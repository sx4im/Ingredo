// Security regression tests for @sx4im/chronos-core.
//
// Two distinct concerns live here:
//   1. The strict-mode guards patch globals to keep a run deterministic. They
//      must not, in doing so, become an easier attack surface than the runtime
//      they emulate.
//   2. `TraceLogger.summarize` produces the `summary` string that everything
//      downstream (send/deliver pairing, the CLI, the Inspector) keys on, from
//      arbitrary user payloads. It must never throw and never be misleading.

import { describe, it, expect } from "vitest";
import { Simulator } from "../src/simulator.js";
import { installGuards } from "../src/strict.js";
import { TraceLogger } from "../src/trace.js";
import { RealEnv } from "../src/real.js";
import { InvariantViolated } from "../src/invariants.js";

function guarded<T>(fn: () => T): T {
  const sim = new Simulator({ seed: 1n, nodes: 1 });
  const env = sim.nodes[0]!.env;
  const guards = installGuards(env, "route");
  try {
    return fn();
  } finally {
    guards.restore();
  }
}

describe("strict mode — the guarded setTimeout is not an eval sink", () => {
  it("refuses a string handler instead of compiling it", () => {
    // `new Function(handler)` would turn any string reaching a forgotten global
    // timer — a simulated peer's payload, a capsule field — into executed code.
    // Node's own setTimeout refuses string handlers; so must the guard.
    guarded(() => {
      expect(() => globalThis.setTimeout("globalThis.__pwned = true" as never, 0)).toThrow(TypeError);
    });
    expect((globalThis as Record<string, unknown>).__pwned).toBeUndefined();
  });

  it("still accepts a function handler and routes it through the sim", () => {
    guarded(() => {
      let fired = false;
      const handle = globalThis.setTimeout(() => {
        fired = true;
      }, 5);
      expect(handle).toBeDefined();
      expect(fired).toBe(false); // virtual time has not advanced
    });
  });

  it("restores every patched global", () => {
    const realSetTimeout = globalThis.setTimeout;
    const realRandom = Math.random;
    guarded(() => {
      expect(globalThis.setTimeout).not.toBe(realSetTimeout);
    });
    expect(globalThis.setTimeout).toBe(realSetTimeout);
    expect(Math.random).toBe(realRandom);
  });
});

describe("TraceLogger.summarize", () => {
  it("does not mistake a SHARED reference for a circular one", () => {
    // `{ a: x, b: x }` is an extremely common message shape. Tracking every
    // object ever seen (rather than the ancestor chain) reported the second
    // occurrence as [Circular], corrupting the summary that send/deliver
    // pairing matches on — two identical messages would stop pairing.
    const shared = { id: 7 };
    expect(TraceLogger.summarize({ a: shared, b: shared })).toBe('{"a":{"id":7},"b":{"id":7}}');
  });

  it("still detects a genuine cycle", () => {
    const cyclic: Record<string, unknown> = { name: "n" };
    cyclic.self = cyclic;
    const s = TraceLogger.summarize(cyclic);
    expect(s).toContain("[Circular]");
  });

  it("never throws on a payload JSON cannot represent", () => {
    expect(() => TraceLogger.summarize(10n)).not.toThrow();
    expect(() => TraceLogger.summarize(() => 1)).not.toThrow();
    expect(() => TraceLogger.summarize(Symbol("s"))).not.toThrow();
    expect(TraceLogger.summarize(undefined)).toBe("undefined");
  });

  it("truncates so one payload cannot dominate a trace", () => {
    expect(TraceLogger.summarize({ big: "x".repeat(5000) }).length).toBeLessThanOrEqual(81);
  });

  it("is deterministic — the same payload always summarizes identically", () => {
    const payload = { term: 2, entries: [1, 2, 3], from: "node-0" };
    const first = TraceLogger.summarize(payload);
    for (let i = 0; i < 100; i++) expect(TraceLogger.summarize(payload)).toBe(first);
  });
});

describe("RealEnv.random — the production entropy source", () => {
  it("returns floats in [0, 1)", () => {
    const env = new RealEnv({ nodeId: "n", transport: { send: () => {}, onReceive: () => {} } });
    for (let i = 0; i < 1000; i++) {
      const v = env.random();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("does not repeat (it is a CSPRNG draw, not a fixed value)", () => {
    const env = new RealEnv({ nodeId: "n", transport: { send: () => {}, onReceive: () => {} } });
    const seen = new Set<number>();
    for (let i = 0; i < 1000; i++) seen.add(env.random());
    expect(seen.size).toBe(1000);
  });
});

describe("InvariantViolated", () => {
  it("reports the detail as a detail, not as a timestamp", () => {
    const e = new InvariantViolated("at-most-one-leader", "two leaders in term 4");
    expect(e.message).toContain("two leaders in term 4");
    expect(e.message).not.toContain("t=two leaders");
  });
});
