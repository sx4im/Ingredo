// Wrapper tests for the @sx4im/chronos-vitest public surface (§4.4).
//
// We drive the pure engines (runSimTest, replayCapsule, resolveSeeds) directly,
// so we never register a *failing* vitest test (simTest throws on the first
// violation). One real `simTest` proves the registration glue end-to-end.
//
// Capsules are written to per-test temp dirs (mkdtemp under os.tmpdir), never the
// repo's `.chronos`, so the suite leaves no artifacts. Real `fs` here is the test
// harness, not simulated code — it does not touch the prime directive's
// in-simulation entropy ban.

import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  simTest,
  runSimTest,
  expectInvariant,
  replayCapsule,
  resolveSeeds,
  readCapsule,
  executeScenario,
  buildSimulator,
  type SimTestBody,
} from "@sx4im/chronos-vitest";

function freshDir(): string {
  return mkdtempSync(join(tmpdir(), "chronos-vitest-"));
}

// Breaks the "never-crashed" safety invariant as soon as the scheduler takes its
// first step. The trigger is a timer on node-1 so that crashing node-0 (which
// cancels node-0's pending events) does not cancel it. Deterministic for any
// seed — the violation is the manual crash, not network faults.
const violatingBody: SimTestBody = (sim) => {
  expectInvariant("never-crashed", (w) => w.crashedNodes.length === 0);
  sim.nodes[1]!.env.setTimeout(() => {}, 1);
  sim.crash(sim.nodes[0]!.id);
};

// One node pings another; never violates. Used for the real `simTest`.
const cleanBody: SimTestBody = (sim) => {
  sim.nodes[1]!.env.net.onReceive(() => {});
  sim.nodes[0]!.env.net.send("node-1", { msg: "ping" });
};

// --- real Vitest registration (must stay green) ---------------------------

simTest(
  "simTest registers + passes a clean scenario across seeds",
  { seeds: 3, nodes: 3, chronosDir: freshDir() },
  cleanBody,
);

// --- resolveSeeds ---------------------------------------------------------

describe("resolveSeeds", () => {
  it("expands a count to [0..n-1]", () => {
    expect(resolveSeeds({ seeds: 3, nodes: 3 })).toEqual([0n, 1n, 2n]);
  });

  it("passes an explicit bigint array through unchanged", () => {
    expect(resolveSeeds({ seeds: [7n, 9n], nodes: 2 })).toEqual([7n, 9n]);
  });

  it("honors CHRONOS_SEED, overriding both count and array", () => {
    const prev = process.env.CHRONOS_SEED;
    try {
      process.env.CHRONOS_SEED = "42";
      expect(resolveSeeds({ seeds: 5, nodes: 3 })).toEqual([42n]);
      expect(resolveSeeds({ seeds: [1n, 2n], nodes: 3 })).toEqual([42n]);
    } finally {
      if (prev === undefined) delete process.env.CHRONOS_SEED;
      else process.env.CHRONOS_SEED = prev;
    }
  });

  describe("CHRONOS_MAX_SEEDS", () => {
    const withEnv = (value: string | undefined, fn: () => void): void => {
      const prev = process.env.CHRONOS_MAX_SEEDS;
      try {
        if (value === undefined) delete process.env.CHRONOS_MAX_SEEDS;
        else process.env.CHRONOS_MAX_SEEDS = value;
        fn();
      } finally {
        if (prev === undefined) delete process.env.CHRONOS_MAX_SEEDS;
        else process.env.CHRONOS_MAX_SEEDS = prev;
      }
    };

    it("caps a count-form sweep to a deterministic prefix", () => {
      withEnv("3", () => {
        expect(resolveSeeds({ seeds: 1000, nodes: 2 })).toEqual([0n, 1n, 2n]);
      });
    });

    it("never grows a sweep and leaves small counts untouched", () => {
      withEnv("200", () => {
        expect(resolveSeeds({ seeds: 5, nodes: 2 })).toEqual([0n, 1n, 2n, 3n, 4n]);
      });
    });

    it("does not cap an explicit seed array (those are deliberate)", () => {
      withEnv("1", () => {
        expect(resolveSeeds({ seeds: [5n, 9n, 11n], nodes: 2 })).toEqual([
          5n, 9n, 11n,
        ]);
      });
    });

    it("is overridden by CHRONOS_SEED like every other seed source", () => {
      withEnv("2", () => {
        const prevSeed = process.env.CHRONOS_SEED;
        try {
          process.env.CHRONOS_SEED = "77";
          expect(resolveSeeds({ seeds: 1000, nodes: 2 })).toEqual([77n]);
        } finally {
          if (prevSeed === undefined) delete process.env.CHRONOS_SEED;
          else process.env.CHRONOS_SEED = prevSeed;
        }
      });
    });

    it("rejects malformed values loudly", () => {
      withEnv("-5", () =>
        expect(() => resolveSeeds({ seeds: 10, nodes: 2 })).toThrow(
          /CHRONOS_MAX_SEEDS must be a positive decimal integer/,
        ),
      );
      withEnv("abc", () =>
        expect(() => resolveSeeds({ seeds: 10, nodes: 2 })).toThrow(
          /CHRONOS_MAX_SEEDS must be a positive decimal integer/,
        ),
      );
      withEnv("0", () =>
        expect(() => resolveSeeds({ seeds: 10, nodes: 2 })).toThrow(
          /CHRONOS_MAX_SEEDS must be a positive decimal integer/,
        ),
      );
    });

    it("unset means no cap (local runs stay at full strength)", () => {
      withEnv(undefined, () => {
        expect(resolveSeeds({ seeds: 4, nodes: 2 })).toEqual([0n, 1n, 2n, 3n]);
      });
    });
  });
});

// --- runSimTest -----------------------------------------------------------

describe("runSimTest", () => {
  it("returns violated:false across seeds for a clean scenario", async () => {
    const out = await runSimTest({ seeds: 4, nodes: 3, chronosDir: freshDir() }, cleanBody);
    expect(out.violated).toBe(false);
    expect(out.seed).toBe(0n);
  });

  it("stops at the first violating seed and writes a capsule", async () => {
    const dir = freshDir();
    const out = await runSimTest({ seeds: [5n, 3n, 1n], nodes: 3, chronosDir: dir }, violatingBody);
    expect(out.violated).toBe(true);
    expect(out.seed).toBe(5n); // first seed wins
    expect(out.invariant?.name).toBe("never-crashed");
    expect(out.capsulePath).toBe(join(dir, "failures", "5.json"));
    expect(existsSync(out.capsulePath!)).toBe(true);
  });

  it("forces exactly the CHRONOS_SEED seed (override)", async () => {
    const dir = freshDir();
    const prev = process.env.CHRONOS_SEED;
    try {
      process.env.CHRONOS_SEED = "42";
      const out = await runSimTest({ seeds: [1n, 5n, 7n], nodes: 3, chronosDir: dir }, violatingBody);
      expect(out.violated).toBe(true);
      expect(out.seed).toBe(42n); // override → only 42 ran (and it violated)
      expect(out.capsulePath).toBe(join(dir, "failures", "42.json"));
    } finally {
      if (prev === undefined) delete process.env.CHRONOS_SEED;
      else process.env.CHRONOS_SEED = prev;
    }
  });

  it("treats a step-budget timeout as neither violation nor proof of health", async () => {
    // The scenario schedules more wake events than maxSteps allows. The run is
    // TRUNCATED: no capsule may be written (nothing violated), but the outcome
    // must not silently read as "invariants held" either — executeScenario
    // reports timedOut so callers can distinguish truncated from settled.
    const out = await executeScenario(
      buildSimulator({ seeds: [9n], nodes: 2, maxSteps: 2 }, 9n),
      (sim) => {
        sim.addInvariant({
          name: "trivially true",
          kind: "liveness",
          check: () => true,
        });
        for (let i = 1; i <= 5; i++) {
          sim.scheduler.schedule(i, () => {}, { nodeId: "node-0" });
        }
      },
    );
    expect(out.violation).toBeUndefined();
    expect(out.timedOut).toBe(true);
  });
});

// --- expectInvariant ------------------------------------------------------

describe("expectInvariant", () => {
  it("sync zero-arg form throws with name + detail", async () => {
    const body: SimTestBody = () => {
      expectInvariant("post-cond", () => false);
    };
    const out = await runSimTest({ seeds: 1, nodes: 2, chronosDir: freshDir() }, body);
    expect(out.violated).toBe(true);
    expect(out.invariant?.name).toBe("post-cond");
    expect(out.invariant?.detail).toBe("expectInvariant returned false");
  });

  it("safety world-arg form registers a per-step check", async () => {
    const out = await runSimTest({ seeds: 1, nodes: 3, chronosDir: freshDir() }, violatingBody);
    expect(out.violated).toBe(true);
    expect(out.invariant?.name).toBe("never-crashed");
    expect(out.invariant?.detail).toBe("check() returned false");
  });
});

// --- replay: the determinism proof ----------------------------------------

describe("replayCapsule", () => {
  let capsulePath = "";
  beforeAll(async () => {
    const dir = freshDir();
    const out = await runSimTest({ seeds: [11n], nodes: 3, chronosDir: dir }, violatingBody);
    capsulePath = out.capsulePath!;
  });

  it("rebuilds the sim and reproduces the violation + bit-identical trace", async () => {
    const capsule = await readCapsule(capsulePath);
    const { reproduced, violation, trace } = await replayCapsule(capsulePath, violatingBody);
    expect(violation?.name).toBe("never-crashed");
    expect(reproduced).toBe(true);
    expect(trace.events).toEqual(capsule.trace.events);
  });
});
