// Failure capsule I/O (§3.18) — the {seed, config} minimum + the Trace.
//
// A capsule is plain JSON so it can be saved, shared, and `chronos replay`ed:
// rebuilding a Simulator from the same seed+config+nodes and re-running the
// body reproduces the violation — and the trace — bit-for-bit.
//
// A capsule is a *shared artifact* (CI artifact, attachment in an issue, a file
// handed to a teammate) and therefore UNTRUSTED input. `readCapsule` parses it
// and runs it through `validateCapsule` before anything touches the Simulator:
// a malformed capsule must produce a clear `InvalidCapsule` error, never a
// confusing NaN/Infinity/negative-value that silently corrupts the scheduler or
// disables chaos (see Area 2 / B2 of the security audit). In particular the
// JSON.parse failure is converted to a content-free error — Node's SyntaxError
// embeds the offending file bytes, which on `chronos replay <arbitrary-file>`
// would disclose that file's contents via the error string.

import { mkdir, writeFile, readFile, rename, stat, unlink } from "node:fs/promises";
import { dirname, join, basename } from "node:path";
import { CHRONOS_VERSION } from "@sx4im/chronos-core";
import type { Simulator, NetworkConfig, ChaosConfig, Trace } from "@sx4im/chronos-core";
import type { FailureCapsule } from "./types.js";

export interface CapsuleWriteResult {
  path: string;
}

/** Raised by `readCapsule`/`validateCapsule` when a capsule is malformed. The
 *  message is deliberately content-free (never echoes capsule bytes) so it is
 *  safe to print on an untrusted path. */
export class InvalidCapsule extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCapsule";
  }
}

function fail(message: string): never {
  throw new InvalidCapsule(message);
}

function isFiniteNum(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

function isFiniteInt(x: unknown): x is number {
  return typeof x === "number" && Number.isInteger(x) && Number.isFinite(x);
}

// Decimal integer, optional leading minus, up to 100 digits — bounds the BigInt
// allocation so a giant `seed` string can't be used as a trivial DoS. Matches
// exactly what `BigInt(str)` accepts on the happy path (no hex, no whitespace).
const RE_SEED = /^-?\d{1,100}$/;

const MAX_NODES = 256; // an array of any more is an obvious malformed/crafted capsule
const MAX_NODE_ID = 64;
const MAX_NAME = 256;
const MAX_DETAIL = 4096;
const MAX_VERSION = 64; // chronosVersion field — bound it so a malformed capsule
// can't ship a multi-GB string as a trivial memory DoS.
const MAX_STEPS = 10_000_000; // matches the engine's safe upper bound
const MAX_EVENTS = 2_000_000; // bounds the parse; the replay cap is maxSteps anyway
const MAX_SUMMARY = 4096; // per-event `summary`/`detail`; the writer caps summaries at 80

/** Hard ceiling on a capsule file, enforced BEFORE the bytes are read. Every
 *  other bound in this file is a post-parse check, which is too late: `readFile`
 *  materializes the whole file and `JSON.parse` materializes the whole object
 *  graph, so a 4 GB `.json` handed to `chronos trace` is an OOM crash long
 *  before `MAX_EVENTS` gets a say. A real capsule is a few MB at the 2M-event
 *  ceiling; 128 MB leaves two orders of magnitude of headroom.
 *  `CHRONOS_MAX_CAPSULE_BYTES` raises it for a deliberately huge local capsule. */
const DEFAULT_MAX_CAPSULE_BYTES = 128 * 1024 * 1024;

function maxCapsuleBytes(): number {
  const raw = process.env.CHRONOS_MAX_CAPSULE_BYTES;
  if (raw === undefined || !/^\d{1,19}$/.test(raw)) return DEFAULT_MAX_CAPSULE_BYTES;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : DEFAULT_MAX_CAPSULE_BYTES;
}

function inUnitInterval(x: unknown, label: string): void {
  if (!isFiniteNum(x) || (x as number) < 0 || (x as number) > 1) {
    fail(`\`config.${label}\` must be a finite number in [0, 1]`);
  }
}

function validateNetwork(n: unknown): asserts n is NetworkConfig {
  if (typeof n !== "object" || n === null || Array.isArray(n)) {
    fail("`config.network` is not an object");
  }
  const cfg = n as Record<string, unknown>;
  if (!isFiniteNum(cfg.minLatency)) fail("`config.network.minLatency` is not a finite number");
  if (!isFiniteNum(cfg.maxLatency)) fail("`config.network.maxLatency` is not a finite number");
  if ((cfg.minLatency as number) < 0) fail("`config.network.minLatency` must be >= 0");
  if ((cfg.maxLatency as number) < (cfg.minLatency as number)) {
    fail("`config.network.maxLatency` must be >= minLatency");
  }
  inUnitInterval(cfg.dropProb, "network.dropProb");
  inUnitInterval(cfg.dupProb, "network.dupProb");
}

function validateChaos(c: unknown): asserts c is Required<ChaosConfig> {
  if (typeof c !== "object" || c === null || Array.isArray(c)) {
    fail("`config.chaos` is not an object");
  }
  const o = c as Record<string, unknown>;
  inUnitInterval(o.partitionProb, "chaos.partitionProb");
  inUnitInterval(o.crashProb, "chaos.crashProb");
  inUnitInterval(o.restartProb, "chaos.restartProb");
  if (!isFiniteNum(o.maxPartitionMs) || (o.maxPartitionMs as number) < 0) {
    fail("`config.chaos.maxPartitionMs` must be a finite number >= 0");
  }
  inUnitInterval(o.maxCrashFraction, "chaos.maxCrashFraction");
}

function isBoundedString(x: unknown, max: number): x is string {
  return typeof x === "string" && x.length <= max;
}

/** Validate one `trace.events` entry.
 *
 *  Trace events are never re-scheduled — replay rebuilds them from the seed —
 *  so a malformed event cannot poison a run. It can, however, poison every
 *  CONSUMER of the trace: `chronos trace` interpolates `ev.summary` into a
 *  terminal line, `chronos export` writes it into a CSV cell, and the Inspector
 *  renders it into the DOM. Those readers all assume the discriminated union in
 *  `@sx4im/chronos-core`'s `TraceEvent` actually holds, and an event whose
 *  `groups` is a string or whose `kind` is unknown crashes them with a raw
 *  stack trace. Validating the union here — once, at the trust boundary — is
 *  what lets every downstream renderer stay simple. */
function validateEvent(e: unknown, i: number): void {
  const at = `\`trace.events[${i}]\``;
  if (typeof e !== "object" || e === null || Array.isArray(e)) {
    fail(`${at} is not an object`);
  }
  const ev = e as Record<string, unknown>;
  if (!isFiniteNum(ev.t)) fail(`${at}.t must be a finite number`);
  if (!isFiniteInt(ev.seq)) fail(`${at}.seq must be an integer`);

  const nodeId = (label: string): void => {
    if (!isBoundedString(ev.nodeId, MAX_NODE_ID)) {
      fail(`${at}.nodeId must be a string (max ${MAX_NODE_ID} chars) for kind "${label}"`);
    }
  };
  const endpoints = (label: string): void => {
    if (!isBoundedString(ev.from, MAX_NODE_ID) || !isBoundedString(ev.to, MAX_NODE_ID)) {
      fail(`${at}.from/.to must be strings (max ${MAX_NODE_ID} chars) for kind "${label}"`);
    }
    if (!isBoundedString(ev.summary, MAX_SUMMARY)) {
      fail(`${at}.summary must be a string (max ${MAX_SUMMARY} chars) for kind "${label}"`);
    }
  };

  switch (ev.kind) {
    case "timer":
      // The only kind with an optional nodeId (a global timer has none).
      if (ev.nodeId !== undefined && !isBoundedString(ev.nodeId, MAX_NODE_ID)) {
        fail(`${at}.nodeId must be a string (max ${MAX_NODE_ID} chars) when present`);
      }
      return;
    case "wake":
    case "crash":
    case "restart":
      nodeId(ev.kind);
      return;
    case "send":
    case "deliver":
      endpoints(ev.kind);
      return;
    case "partition": {
      if (!Array.isArray(ev.groups) || ev.groups.length > MAX_NODES) {
        fail(`${at}.groups must be an array of at most ${MAX_NODES} groups`);
      }
      for (const g of ev.groups as unknown[]) {
        if (!Array.isArray(g) || g.length > MAX_NODES) {
          fail(`${at}.groups entries must be arrays of at most ${MAX_NODES} node ids`);
        }
        for (const n of g as unknown[]) {
          if (!isBoundedString(n, MAX_NODE_ID)) {
            fail(`${at}.groups node ids must be strings (max ${MAX_NODE_ID} chars)`);
          }
        }
      }
      if (!isFiniteNum(ev.healAt)) fail(`${at}.healAt must be a finite number`);
      return;
    }
    case "invariant-violation":
      if (!isBoundedString(ev.name, MAX_NAME)) {
        fail(`${at}.name must be a string (max ${MAX_NAME} chars)`);
      }
      if (!isBoundedString(ev.detail, MAX_DETAIL)) {
        fail(`${at}.detail must be a string (max ${MAX_DETAIL} chars)`);
      }
      return;
    default:
      fail(`${at}.kind is not a known trace event kind`);
  }
}

/** Validate the `trace` envelope AND every event in it. The envelope fields
 *  (`seed`, `nodes`, `result`) are what `chronos trace`/`stats`/`export` and the
 *  Inspector's header read directly; before this check a capsule that merely
 *  omitted `trace.nodes` crashed `chronos trace` with a TypeError. */
function validateTrace(t: unknown): void {
  if (typeof t !== "object" || t === null || Array.isArray(t)) {
    fail("`trace` is not an object");
  }
  const tr = t as Record<string, unknown>;
  if (typeof tr.seed !== "string" || !RE_SEED.test(tr.seed)) {
    fail("`trace.seed` must be a decimal integer string");
  }
  if (!Array.isArray(tr.nodes) || tr.nodes.length > MAX_NODES) {
    fail(`\`trace.nodes\` must be an array of at most ${MAX_NODES} strings`);
  }
  for (let i = 0; i < tr.nodes.length; i++) {
    if (!isBoundedString(tr.nodes[i], MAX_NODE_ID)) {
      fail(`\`trace.nodes[${i}]\` must be a string (max ${MAX_NODE_ID} chars)`);
    }
  }
  if (tr.result !== "ok" && tr.result !== "violation") {
    fail('`trace.result` must be "ok" or "violation"');
  }
  if (!Array.isArray(tr.events) || tr.events.length > MAX_EVENTS) {
    fail(`\`trace.events\` must be an array (max ${MAX_EVENTS} entries)`);
  }
  for (let i = 0; i < tr.events.length; i++) validateEvent(tr.events[i], i);
}

/** Strictly validate an already-parsed capsule object. Returns the object typed
 *  as a `FailureCapsule`; throws `InvalidCapsule` (content-free message) on any
 *  shape/range violation. The fields the Simulator reads (`seed`, `nodes`,
 *  `maxSteps`, `config.network`, `config.chaos`) are the load-bearing checks:
 *  a NaN/Infinity/negative there is the scheduler-corruption / silent-chaos-off
 *  path (B2). The `trace` envelope and every event in it are validated too —
 *  not because they can poison a run (they are never re-scheduled) but because
 *  every renderer downstream (CLI trace/stats/export, the Inspector) treats the
 *  `TraceEvent` union as a guarantee. */
export function validateCapsule(obj: unknown): FailureCapsule {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    fail("capsule root is not a JSON object");
  }
  const c = obj as Record<string, unknown>;

  const seed = c.seed;
  if (typeof seed !== "string" || !RE_SEED.test(seed)) {
    fail("`seed` must be a decimal integer string");
  }

  const nodes = c.nodes;
  if (!Array.isArray(nodes) || nodes.length < 1 || nodes.length > MAX_NODES) {
    fail(`\`nodes\` must be an array of 1..${MAX_NODES} strings`);
  }
  for (let i = 0; i < nodes.length; i++) {
    const id = nodes[i];
    if (typeof id !== "string" || id.length < 1 || id.length > MAX_NODE_ID) {
      fail(`\`nodes[${i}]\` must be a non-empty string (max ${MAX_NODE_ID} chars)`);
    }
  }

  const maxSteps = c.maxSteps;
  if (!isFiniteInt(maxSteps) || maxSteps < 1 || maxSteps > MAX_STEPS) {
    fail(`\`maxSteps\` must be an integer in [1, ${MAX_STEPS}]`);
  }

  const config = c.config;
  if (typeof config !== "object" || config === null || Array.isArray(config)) {
    fail("`config` is not an object");
  }
  const configRec = config as Record<string, unknown>;
  validateNetwork(configRec.network);
  validateChaos(configRec.chaos);

  const invariant = c.invariant;
  if (typeof invariant !== "object" || invariant === null || Array.isArray(invariant)) {
    fail("`invariant` is not an object");
  }
  const invRec = invariant as Record<string, unknown>;
  if (typeof invRec.name !== "string" || invRec.name.length > MAX_NAME) {
    fail(`\`invariant.name\` must be a string (max ${MAX_NAME} chars)`);
  }
  if (typeof invRec.detail !== "string" || invRec.detail.length > MAX_DETAIL) {
    fail(`\`invariant.detail\` must be a string (max ${MAX_DETAIL} chars)`);
  }

  validateTrace(c.trace);

  // After validation the object satisfies the FailureCapsule shape; the
  // chronosVersion is optional (older capsules omitted it) and defaulted here.
  if (typeof c.chronosVersion === "string" && c.chronosVersion.length > MAX_VERSION) {
    fail(`\`chronosVersion\` length must be <= ${MAX_VERSION}`);
  }
  return {
    chronosVersion: typeof c.chronosVersion === "string" ? c.chronosVersion : "",
    seed,
    nodes: nodes as string[],
    config: config as { network: NetworkConfig; chaos: Required<ChaosConfig> },
    maxSteps,
    invariant: invRec as { name: string; detail: string },
    trace: c.trace as Trace,
  };
}

/** Build the in-memory capsule object from a violating Simulator. */
export function buildCapsule(
  seed: bigint,
  sim: Simulator,
  violation: { name: string; detail: string },
): FailureCapsule {
  const config = {
    network: sim.networkConfig,
    chaos: sim.chaosConfig,
  };
  const nodes = sim.nodes.map((n) => n.id);
  return {
    chronosVersion: CHRONOS_VERSION,
    seed: String(seed),
    nodes,
    config,
    maxSteps: sim.maxSteps,
    invariant: violation,
    trace: sim.trace.toTrace(String(seed), config, nodes, "violation"),
  };
}

/** Write a built capsule object to an explicit absolute path, ATOMICALLY: a
 *  per-process temp file in the SAME directory, then `rename` into place. A
 *  crash mid-write never leaves a half-written capsule — the reproduction
 *  artifact the framework exists to preserve stays intact. (The prime directive
 *  bans entropy *inside* simulations; this is the harness, so `process.pid` in
 *  the temp name is fine — it never enters the capsule or the trace.) The temp
 *  file is created in the destination directory so the `rename` never crosses a
 *  filesystem boundary (which would make it non-atomic on some platforms).
 *
 *  Used by `writeCapsule` (the `<dir>/failures/<seed>.json` layout) and by the
 *  shrinker (`shrinkCapsule`), which writes a `<seed>.shrunk.json` sibling next
 *  to an existing capsule — never overwriting the original. */
export async function writeCapsuleTo(path: string, capsule: FailureCapsule): Promise<void> {
  const dir = dirname(path);
  await mkdir(dir, { recursive: true });
  const gitignoreTarget = basename(dir) === "failures" ? dirname(dir) : dir;
  const gitignorePath = join(gitignoreTarget, ".gitignore");
  await writeFile(gitignorePath, "*\n", { flag: "wx" }).catch(() => {
    /* ignore if .gitignore already exists */
  });
  const json = JSON.stringify(capsule, null, 2);
  // Same directory as the final file → same filesystem → `rename` is atomic.
  //
  // The temp name must be UNPREDICTABLE and the create must be EXCLUSIVE. With
  // a name derived only from the pid, anyone who can write the capsule
  // directory (a shared CI workspace, a world-writable output dir) can
  // pre-create that path as a symlink to a file they want clobbered; a plain
  // `writeFile` follows the symlink and writes through it with the running
  // user's privileges. `wx` makes the open fail if the path exists at all —
  // symlink included — and `0o600` keeps the capsule unreadable by other users
  // in the window before the rename.
  const tmp = `${path}.${process.pid}.${nextTmpSuffix()}.tmp`;
  await writeFile(tmp, json, { encoding: "utf8", flag: "wx", mode: 0o600 });
  try {
    await rename(tmp, path);
  } catch (e) {
    await unlink(tmp).catch(() => {
      /* best effort — the rename failure is the real error */
    });
    throw e;
  }
}

// A process-local counter for temp-file names. Deliberately NOT `Math.random()`:
// this is harness code, but the prime directive's "one entropy source" rule is
// easier to keep honest when there is simply no `Math.random()` anywhere outside
// `real.ts`. Uniqueness within a pid is all `wx` needs to avoid a self-collision.
let tmpCounter = 0;
function nextTmpSuffix(): string {
  tmpCounter = (tmpCounter + 1) >>> 0;
  return tmpCounter.toString(36);
}

/** Write a capsule to `<dir>/failures/<seed>.json` and return its path.
 *  ATOMIC: delegates to `writeCapsuleTo` (same-directory temp + rename) so a
 *  crash mid-write never leaves a half-written capsule. */
export async function writeCapsule(
  dir: string,
  seed: bigint,
  sim: Simulator,
  violation: { name: string; detail: string },
): Promise<string> {
  const path = join(dir, "failures", `${seed}.json`);
  await writeCapsuleTo(path, buildCapsule(seed, sim, violation));
  return path;
}

/** Load and strictly validate a capsule from disk. Any malformed capsule (or a
 *  non-JSON file handed in by mistake) raises `InvalidCapsule` with a
 *  content-free message — never the raw `JSON.parse` SyntaxError, which embeds
 *  file bytes and would disclose e.g. `/etc/passwd` on a misdirected path. */
export async function readCapsule(path: string): Promise<FailureCapsule> {
  const limit = maxCapsuleBytes();
  const info = await stat(path);
  if (info.size > limit) {
    throw new InvalidCapsule(
      `capsule file is larger than the ${limit}-byte limit (set CHRONOS_MAX_CAPSULE_BYTES to raise it)`,
    );
  }
  const data = await readFile(path, "utf8");
  let obj: unknown;
  try {
    obj = JSON.parse(data, reviveSafely);
  } catch (e) {
    if (e instanceof InvalidCapsule) throw e;
    throw new InvalidCapsule("capsule is not valid JSON");
  }
  return validateCapsule(obj);
}

/** `JSON.parse` reviver that refuses `__proto__` outright.
 *
 *  `JSON.parse('{"__proto__":{"isAdmin":true}}')` does not itself pollute
 *  anything — it creates a plain own property. The danger is downstream: the
 *  parsed `config`/`trace` objects are spread, merged, and passed into the
 *  Simulator, and any one of those steps performed with `Object.assign` or a
 *  hand-written deep merge WOULD trigger the `__proto__` setter and mutate
 *  `Object.prototype` for the whole process. Dropping the key at the parse
 *  boundary means no future refactor downstream can reintroduce that path. */
function reviveSafely(this: unknown, key: string, value: unknown): unknown {
  if (key === "__proto__") {
    throw new InvalidCapsule("capsule contains a forbidden `__proto__` key");
  }
  return value;
}
