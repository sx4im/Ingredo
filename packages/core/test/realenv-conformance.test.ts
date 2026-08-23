// RealEnv ↔ SimEnv conformance (the DI contract's proof of parity).
//
// The whole selling point of the injected-env contract is that the SAME system
// code runs against the simulator in tests and against RealEnv in production.
// That claim deserves a test: this suite runs one scripted "system" — timers,
// sleeps, message sends/receives — through BOTH adapters and asserts the
// observable event ORDER matches. Values differ by design (virtual clock vs
// wall clock, seeded PRNG vs CSPRNG); ordering must not.
//
// The Sim side uses the scheduler + virtual clock; the Real side uses genuine
// Node timers with tiny delays (5–12 ms) so the suite stays fast while still
// exercising real async delivery.

import { describe, it, expect } from "vitest";
import { Simulator } from "../src/simulator.js";
import { RealEnv, type RealTransport } from "../src/real.js";
import type { SimEnv } from "../src/env.js";

type Log = string[];

/** The system under test: written ONCE against the SimEnv INTERFACE only — it
 *  never knows which adapter it is talking to. It registers two out-of-order
 *  timers (5ms must beat 10ms), resumes from an env.sleep(12), then pings its
 *  peer. Every observable step is logged with the adapter's own env.now(). */
function runSystem(env: SimEnv, log: Log): void {
  let last = -Infinity;
  const observe = (label: string): void => {
    const t = env.now();
    expect(t).toBeGreaterThanOrEqual(last); // time never goes backwards
    last = t;
    log.push(`${label}@${t}`);
  };

  env.net.onReceive((from, payload) => {
    observe(`recv:${from}:${String(payload)}`);
  });

  // Out-of-order registration: the 5ms timer must fire FIRST.
  env.setTimeout(() => observe("timer-5"), 5);
  env.setTimeout(() => observe("timer-10"), 10);

  void env.sleep(12).then(() => {
    observe("slept");
    env.net.send("peer", "ping");
  });
}

/** The peer's behavior — also written once against the interface. */
function runPeer(env: SimEnv): void {
  env.net.onReceive((from, payload) => {
    if (payload === "ping") env.net.send(from, "pong");
  });
}

/** The event ORDER any conforming adapter must produce (timestamps stripped):
 *  both timers before sleep-resumption, 5ms before 10ms. The ping travels
 *  a→peer (the peer receives silently and replies); the only message `a`
 *  observes arriving is the pong. */
const EXPECTED_ORDER = ["timer-5", "timer-10", "slept", "recv:peer:pong"];

const stripTimes = (entries: Log): string[] =>
  entries.map((e) => e.replace(/@\d+(\.\d+)?$/, ""));

async function runSimSide(): Promise<Log> {
  const log: Log = [];
  const sim = new Simulator({ seed: 7n, nodes: ["a", "peer"] });
  runSystem(sim.nodes[0]!.env, log);
  runPeer(sim.nodes[1]!.env);
  await sim.run({ maxSteps: 1000 });
  return log;
}

/** Two RealEnv instances wired through one in-memory order-preserving route
 *  table — the smallest thing that behaves like a real transport without
 *  sockets (nodes must never open real sockets even in tests of the adapter). */
async function runRealSide(): Promise<Log> {
  const log: Log = [];
  const routes = new Map<string, (from: string, payload: unknown) => void>();
  const makeTransport = (nodeId: string): RealTransport => ({
    send(to, payload) {
      queueMicrotask(() => routes.get(to)?.(nodeId, payload));
    },
    onReceive(handler) {
      routes.set(nodeId, handler);
    },
  });

  const envA = new RealEnv({ nodeId: "a", transport: makeTransport("a") });
  const envPeer = new RealEnv({
    nodeId: "peer",
    transport: makeTransport("peer"),
  });

  runSystem(envA, log);
  runPeer(envPeer);

  // Wait out the protocol (sleep 12 + two microtask hops), with headroom for
  // slow CI timers. Bounded wall-clock waits are test-harness concerns, not
  // simulated-time concerns — the prime directive governs code UNDER TEST,
  // and nothing here runs under simulation.
  await new Promise((resolve) => setTimeout(resolve, 80));
  return log;
}

describe("RealEnv conformance — same system, same observable order", () => {
  it("produces the same event order as SimEnv for the scripted system", async () => {
    const simOrder = stripTimes(await runSimSide());
    const realOrder = stripTimes(await runRealSide());

    // Both adapters produce the identical observable sequence.
    expect(simOrder).toEqual(EXPECTED_ORDER);
    expect(realOrder).toEqual(EXPECTED_ORDER);
  });

  it("exposes the same interface surface and value domains (structural parity)", () => {
    const sim = new Simulator({ seed: 1n, nodes: 1 });
    const simEnv = sim.nodes[0]!.env;
    const realEnv = new RealEnv({
      nodeId: "n0",
      transport: { send: () => {}, onReceive: () => {} },
    });

    for (const key of [
      "nodeId",
      "now",
      "random",
      "sleep",
      "setTimeout",
      "net",
    ] as const) {
      expect(key in simEnv).toBe(true);
      expect(key in realEnv).toBe(true);
    }
    expect(typeof simEnv.now()).toBe("number");
    expect(typeof realEnv.now()).toBe("number");

    // random() stays in [0, 1) on the production adapter too.
    for (let i = 0; i < 64; i++) {
      const r = realEnv.random();
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(1);
    }
  });

  it("setTimeout returns a working cancel handle on both adapters", async () => {
    const sim = new Simulator({ seed: 2n, nodes: 1 });
    let simFired = false;
    sim.nodes[0]!.env.setTimeout(() => {
      simFired = true;
    }, 50).cancel();
    await sim.run();
    expect(simFired).toBe(false);

    let realFired = false;
    const realEnv = new RealEnv({
      nodeId: "n0",
      transport: { send: () => {}, onReceive: () => {} },
    });
    realEnv
      .setTimeout(() => {
        realFired = true;
      }, 30)
      .cancel();
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(realFired).toBe(false);
  });
});
