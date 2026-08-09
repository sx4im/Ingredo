// RealEnv — the production adapter with the SAME shape as SimEnv.
// This proves the abstraction is real, not a test-only toy: the same business
// logic runs in tests (against an injected simulated env) and in production
// (against this real env). Only the `env` differs; the code doesn't.

import { randomBytes } from "node:crypto";

import type { SimEnv, SimNet, TimerHandle } from "./env.js";

/** A float in [0, 1) with 53 bits of CSPRNG entropy — the production-side
 *  counterpart to the simulator's xoshiro256** `nextFloat`.
 *
 *  `Math.random()` would satisfy the `SimEnv` contract just as well, but this is
 *  the PRODUCTION adapter: the same business logic that calls `env.random()` for
 *  retry jitter under simulation may call it for a request id, a nonce, or a
 *  token in production, and V8's `Math.random()` is a seedable xorshift whose
 *  internal state an attacker can recover from a handful of observed outputs.
 *  A CSPRNG costs nothing here (nothing in production is replayed) and removes
 *  a whole class of "the AI used Math.random() for a secret" bugs. */
function secureFloat(): number {
  const b = randomBytes(8);
  // Top 53 bits, matching Rng.nextFloat's construction: drop the low 11 bits of
  // the 64-bit draw and divide by 2^53.
  const hi = b.readUInt32BE(0); // bits 63..32
  const lo = b.readUInt32BE(4); // bits 31..0
  return (hi * 2 ** 21 + (lo >>> 11)) / 2 ** 53;
}

export interface RealTransport {
  send(to: string, payload: unknown): void;
  onReceive(handler: (from: string, payload: unknown) => void): void;
}

export interface RealEnvOptions {
  nodeId: string;
  transport: RealTransport;
}

export class RealEnv implements SimEnv {
  readonly net: SimNet;

  constructor(private opts: RealEnvOptions) {
    this.net = {
      send: (to, payload) => opts.transport.send(to, payload),
      onReceive: (handler) =>
        opts.transport.onReceive((from, payload) => handler(from, payload)),
    };
  }

  get nodeId(): string {
    return this.opts.nodeId;
  }

  now(): number {
    return Date.now();
  }

  random(): number {
    return secureFloat();
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setTimeout(cb: () => void, ms: number): TimerHandle {
    const id = globalThis.setTimeout(cb, ms);
    return { cancel: () => globalThis.clearTimeout(id) };
  }
}
