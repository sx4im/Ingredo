// Tests for `replayTest`'s assertion core (`assertReplay`) — the Vitest
// wrapper's engine. We exercise it by generating real failing capsules with
// `runSimTest` and then asserting: smoke mode (no body) and full reproduction
// (with body) PASS; a non-reproducing scenario or missing capsule FAILS.

import { describe, it, expect } from "vitest";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  runSimTest,
  assertReplay,
  type SimTestBody,
} from "@sx4im/chronos-vitest";
import { expectInvariant } from "@sx4im/chronos-vitest";

function freshDir(): string {
  return mkdtempSync(join(tmpdir(), "chronos-replaytest-"));
}

const violatingBody: SimTestBody = (sim) => {
  expectInvariant("never-crashed", (w) => w.crashedNodes.length === 0);
  sim.nodes[1]!.env.setTimeout(() => {}, 1);
  sim.crash(sim.nodes[0]!.id);
};

async function makeCapsule(dir: string): Promise<string> {
  const out = await runSimTest(
    { seeds: [5n], nodes: 3, chronosDir: dir },
    violatingBody,
  );
  expect(out.violated).toBe(true);
  expect(out.capsulePath).toBeDefined();
  expect(existsSync(out.capsulePath!)).toBe(true);
  return out.capsulePath!;
}

describe("assertReplay (replayTest engine)", () => {
  it("smoke mode: capsule loads and records a violation", async () => {
    const capsulePath = await makeCapsule(freshDir());
    // Must not throw — the assertions hold for a genuine capsule.
    await assertReplay(capsulePath);
  });

  it("with body: proves bit-identical reproduction", async () => {
    const capsulePath = await makeCapsule(freshDir());
    await assertReplay(capsulePath, violatingBody);
  });

  it("a non-reproducing scenario fails loudly", async () => {
    const capsulePath = await makeCapsule(freshDir());
    // A body that never violates cannot reproduce the recorded violation.
    const cleanBody: SimTestBody = () => {};
    let failed = false;
    try {
      await assertReplay(capsulePath, cleanBody);
    } catch {
      failed = true;
    }
    expect(failed).toBe(true);
  });

  it("a missing capsule fails loudly", async () => {
    let failed = false;
    try {
      await assertReplay(join(freshDir(), "nope.json"));
    } catch {
      failed = true;
    }
    expect(failed).toBe(true);
  });
});
