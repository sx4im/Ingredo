// Tests for `chronos trace` rendering (formatTraceLines).
//
// The trace view is the human-facing surface of a failure capsule, and every
// string it prints is attacker-chosen (node ids, summaries, invariant detail),
// so each event kind's renderer is exercised directly — including the
// unknown-kind fallback that a hand-written capsule can always reach.

import { describe, it, expect } from "vitest";
import type { Trace, TraceEvent } from "@sx4im/chronos-core";
import { formatTraceLines } from "../src/trace.js";

let seq = 0;
/** A TraceEvent with plausible t/seq defaults; overrides win. Deliberately
 *  loose (`kind: string`) so the unknown-kind fallback branch of the renderer
 *  is reachable from tests. */
function e(over: { kind: string } & Record<string, unknown>): TraceEvent {
  return { t: 10, seq: seq++, ...over } as unknown as TraceEvent;
}

function traceOf(events: TraceEvent[], result: Trace["result"] = "violation"): Trace {
  return { seed: "12345", config: {}, nodes: ["n0", "n1"], events, result };
}

describe("formatTraceLines — every event kind renders", () => {
  it("timer: with and without a nodeId", () => {
    const [hdr, a, b] = formatTraceLines(
      traceOf([e({ kind: "timer" }), e({ kind: "timer", nodeId: "n1" })]),
    );
    expect(hdr).toContain("seed");
    expect(a).toContain("timer");
    expect(b).toContain("timer n1");
    expect(b).not.toBe(a);
  });

  it("wake / send / deliver / crash / restart", () => {
    const lines = formatTraceLines(
      traceOf([
        e({ kind: "wake", nodeId: "n0" }),
        e({ kind: "send", from: "n0", to: "n1", summary: "req(x=1)" }),
        e({ kind: "deliver", from: "n0", to: "n1", summary: "req(x=1)" }),
        e({ kind: "crash", nodeId: "n1" }),
        e({ kind: "restart", nodeId: "n1" }),
      ]),
    ).slice(1);
    expect(lines[0]).toContain("wake n0");
    expect(lines[1]).toContain("send n0→n1 req(x=1)");
    expect(lines[2]).toContain("deliver n0→n1 req(x=1)");
    expect(lines[3]).toContain("crash n1");
    expect(lines[4]).toContain("restart n1");
  });

  it("partition: groups render as bracketed sets with healAt", () => {
    const line = formatTraceLines(traceOf([
      e({ kind: "partition", groups: [["a", "b"], ["c"]], healAt: 42 }),
    ]))[1]!;
    expect(line).toContain("[a,b] | [c]");
    expect(line).toContain("healAt=42");
  });

  it("invariant-violation: name and detail survive, marked VIOLATION", () => {
    const line = formatTraceLines(traceOf([
      e({ kind: "invariant-violation", name: "no-double-commit", detail: "n1 committed twice" }),
    ]))[1]!;
    expect(line).toContain("VIOLATION");
    expect(line).toContain("no-double-commit");
    expect(line).toContain("n1 committed twice");
  });

  it("unknown kinds fall back to a labeled JSON dump instead of throwing", () => {
    const line = formatTraceLines(traceOf([e({ kind: "quantum-flux", nodeId: "n9" })]))[1]!;
    expect(line).toContain("quantum-flux");
    expect(line).toContain("n9");
  });
});

describe("formatTraceLines — header + untrusted text", () => {
  it("header carries seed, nodes, result, and the event count", () => {
    const hdr = formatTraceLines(traceOf([e({ kind: "timer" }), e({ kind: "crash", nodeId: "x" })]))[0]!;
    expect(hdr).toContain("12345");
    expect(hdr).toContain("n0, n1");
    expect(hdr).toContain("violation");
    expect(hdr).toContain("2 events");
  });

  it("result wording follows the status for ok and timeout too", () => {
    for (const result of ["ok", "timeout"] as const) {
      const hdr = formatTraceLines(traceOf([], result))[0]!;
      expect(hdr).toContain(result);
      expect(hdr).toContain("0 events");
    }
  });

  it("attacker escapes in summaries never reach the rendered line", () => {
    const line = formatTraceLines(traceOf([
      e({ kind: "send", from: "n0", to: "n1", summary: "\x1b[2J\x1b[31mevil" }),
    ]))[1]!;
    expect(line).not.toContain("\x1b[");
    expect(line).toContain("evil"); // text survives, escape codes do not
  });
});
