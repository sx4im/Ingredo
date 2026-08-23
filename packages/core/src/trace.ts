// The Trace schema (§3.8) — the source of truth for replay and the Inspector.
// Stable surface: user code and the Inspector depend on this shape.

export type TraceEventInit =
  | { kind: "timer"; nodeId?: string }
  | { kind: "wake"; nodeId: string }
  | {
      kind: "deliver";
      from: string;
      to: string;
      summary: string;
    }
  | { kind: "send"; from: string; to: string; summary: string }
  | { kind: "crash"; nodeId: string }
  | { kind: "restart"; nodeId: string }
  | { kind: "partition"; groups: string[][]; healAt: number }
  | { kind: "invariant-violation"; name: string; detail: string };

// Each recorded event gets t (virtual time) and seq (monotonic log index).
export type TraceEvent = TraceEventInit & { t: number; seq: number };

export interface Trace {
  seed: string; // stringified BigInt
  config: unknown; // network + chaos config used
  nodes: string[];
  events: TraceEvent[];
  /** `"ok"` — the heap drained and all invariants held. `"timeout"` — the step
   *  budget was exhausted while events were still pending, so the run was
   *  TRUNCATED (liveness checks were skipped; nothing here proves liveness).
   *  `"violation"` — an invariant broke. */
  result: "ok" | "violation" | "timeout";
}

/**
 * An append-only log with a single monotonic counter. The counter is the ONLY
 * source of `seq` in a Trace; append order is deterministic (it follows the
 * scheduler's execution order), so a replay from the same seed produces an
 * identical sequence of trace events with identical `seq` values.
 */
export class TraceLogger {
  readonly events: TraceEvent[] = [];
  private counter = 0;

  append(t: number, init: TraceEventInit): TraceEvent {
    const ev = { ...init, t, seq: this.counter++ } as TraceEvent;
    this.events.push(ev);
    return ev;
  }

  /** Snapshot for checkpointing / reproduction. */
  toTrace(
    seed: string,
    config: unknown,
    nodes: string[],
    result: "ok" | "violation" | "timeout",
  ): Trace {
    return { seed, config, nodes, events: [...this.events], result };
  }

  // Deterministic helpers to shrink payload logs to a stable short string.
  // Safely handles circular references and deep structures.
  //
  // Only a value that is its own ANCESTOR is a cycle. Tracking "every object
  // seen anywhere" instead would mark the second occurrence of a merely SHARED
  // reference — `{ a: x, b: x }`, an extremely common message shape — as
  // `[Circular]`, silently corrupting the summary that `send`/`deliver` pairing
  // (CLI stats, Inspector sequence diagram) keys on. So the guard is an
  // ancestor stack maintained via `this` in the replacer, which JSON.stringify
  // binds to the object currently being serialized.
  static summarize(payload: unknown, maxLen = 80): string {
    let s: string | undefined;
    try {
      if (payload === undefined) {
        s = "undefined";
      } else {
        const ancestors: unknown[] = [];
        s = JSON.stringify(payload, function (this: unknown, _key, value: unknown) {
          while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
            ancestors.pop();
          }
          if (typeof value === "object" && value !== null) {
            if (ancestors.includes(value)) return "[Circular]";
            ancestors.push(value);
          }
          return value;
        });
      }
    } catch {
      s = undefined;
    }
    if (s === undefined) {
      // `JSON.stringify` returns undefined for functions/symbols/undefined and
      // throws on BigInt; fall back to a stable, non-throwing description.
      try {
        s = String(payload);
      } catch {
        s = "[unserializable]";
      }
    }
    return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s;
  }
}
