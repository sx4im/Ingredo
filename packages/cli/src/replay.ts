// chronos replay (§3.18, §4.5) — re-run a saved failure capsule and prove
// reproduction. A capsule stores { seed, config } (the minimum to reproduce)
// plus the Trace (for humans). Reproduction needs the system-under-test itself:
// a "scenario" module exporting { body, netFactory? }. With a scenario, this
// rebuilds the sim from the capsule's seed+config and re-runs the body, proving
// the same violation recurs with a bit-identical Trace (the determinism proof).
// Without a scenario, it reports the recorded result and how to reproduce —
// never silently pretending it reproduced.

import { replayCapsule, readCapsule, type SimTestBody, type FailureCapsule } from "@sx4im/chronos-vitest/engine";
import type { NetworkFactory } from "@sx4im/chronos-core";
import { toFileUrl, resolveCapsulePath, resolveScenarioPath, capsuleReadError } from "./util.js";

export interface ScenarioModule {
  body: SimTestBody;
  netFactory?: NetworkFactory;
}

export interface ReplayResult {
  exitCode: number;
  message: string;
  reproduced: boolean;
}

export interface ReplayOptions {
  /** Emit a machine-readable JSON run summary only (no prose or ANSI codes). */
  json?: boolean;
}

/** Dynamic-import a scenario module. Honors both `export default {…}` and named
 * `export { body, netFactory }`. Throws if `body` isn't a function — the caller
 * turns that into a graceful exit-2. */
export async function loadScenario(scenarioPath: string): Promise<ScenarioModule> {
  const resolved = resolveScenarioPath(scenarioPath);
  const url = toFileUrl(resolved);
  const mod = (await import(url)) as Partial<ScenarioModule> & { default?: ScenarioModule };
  const s = (mod.default ?? mod) as Partial<ScenarioModule>;
  if (typeof s.body !== "function") {
    throw new Error(`scenario "${scenarioPath}" did not export a \`body\` function`);
  }
  return {
    body: s.body,
    ...(s.netFactory !== undefined ? { netFactory: s.netFactory } : {}),
  };
}

/** Replay `capsulePath`. With `scenarioPath`, prove reproduction; without it,
 * report the recorded outcome and how to reproduce. Returns an exit code plus a
 * single human-readable message — the bin prints it; tests assert on it. */
export async function replayCommand(
  capsulePath: string,
  scenarioPath?: string,
  options: ReplayOptions = {},
): Promise<ReplayResult> {
  let capsule: FailureCapsule;
  try {
    capsule = await readCapsule(resolveCapsulePath(capsulePath));
  } catch (e) {
    const message = capsuleReadError(capsulePath, e);
    return {
      exitCode: 2,
      message: options.json ? JSON.stringify({ error: message }, null, 2) : message,
      reproduced: false,
    };
  }

  const recorded = {
    seed: capsule.seed,
    nodes: capsule.nodes,
    recordedResult: capsule.trace.result,
    invariant: { name: capsule.invariant.name, detail: capsule.invariant.detail },
    events: capsule.trace.events.length,
  };

  if (scenarioPath === undefined) {
    const status = capsule.trace.result;
    return {
      exitCode: 0,
      message: options.json
        ? JSON.stringify(
            { ...recorded, reproduced: false, scenario: null, rerun: null },
            null,
            2,
          )
        : `capsule recorded result="${status}" — invariant ${capsule.invariant.name} (${capsule.invariant.detail}).\n` +
          `  seed=${capsule.seed}, nodes=[${capsule.nodes.join(", ")}], ${capsule.trace.events.length} events.\n` +
          `Reproduction needs the system-under-test. Re-run with a scenario module:\n` +
          `  $ chronos replay ${capsulePath} <path/to/scenario.{js,ts}>\n` +
          `where the module exports { body, netFactory? } (and optional nodes/network/chaos).`,
      reproduced: false,
    };
  }

  let scenario: ScenarioModule;
  try {
    scenario = await loadScenario(scenarioPath);
  } catch (e) {
    const message =
      `could not import scenario "${scenarioPath}": ${e instanceof Error ? e.message : String(e)}\n` +
      `Tip: .ts scenarios need a TS-aware runner (vitest/tsx); build to .js or run under tsx.`;
    return {
      exitCode: 2,
      message: options.json ? JSON.stringify({ error: message }, null, 2) : message,
      reproduced: false,
    };
  }

  const { reproduced, violation, trace } = await replayCapsule(
    capsulePath,
    scenario.body,
    scenario.netFactory,
  );
  if (reproduced) {
    return {
      exitCode: 0,
      message: options.json
        ? JSON.stringify(
            {
              ...recorded,
              reproduced: true,
              scenario: scenarioPath,
              rerun: {
                result: trace.result,
                events: trace.events.length,
                violation: violation
                  ? { name: violation.name, detail: violation.detail }
                  : null,
              },
            },
            null,
            2,
          )
        : `✓ reproduced: invariant "${violation?.name ?? "<unknown>"}" recurred from seed ${capsule.seed}\n` +
          `  the re-run trace is bit-identical to the capsule (${trace.events.length} events match).`,
      reproduced: true,
    };
  }
  return {
    exitCode: 1,
    message: options.json
      ? JSON.stringify(
          {
            ...recorded,
            reproduced: false,
            scenario: scenarioPath,
            rerun: {
              result: trace.result,
              events: trace.events.length,
              violation: violation
                ? { name: violation.name, detail: violation.detail }
                : null,
            },
          },
          null,
          2,
        )
      : `✗ could NOT reproduce the violation from seed ${capsule.seed}\n` +
        `  re-run violation: ${violation?.name ?? "<none>"}\n` +
        `  re-run events: ${trace.events.length} (capsule recorded ${capsule.trace.events.length})\n` +
        `  Most likely the scenario's netFactory/network doesn't match the one that produced the capsule.`,
    reproduced: false,
  };
}
