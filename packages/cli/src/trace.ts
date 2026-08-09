// chronos trace (§4.5) — pretty-print a capsule's recorded event timeline.
//
// Coloring is TTY-gated and respects NO_COLOR, so piped output (CI logs, tests)
// stays plain. No color library — raw ANSI escapes only (keep the bin lean).

import { readCapsule, type FailureCapsule } from "@sx4im/chronos-vitest/engine";
import type { Trace, TraceEvent } from "@sx4im/chronos-core";
import { resolveCapsulePath, capsuleReadError } from "./util.js";
import { safeText } from "./sanitize.js";

function useColor(): boolean {
  return !!process.stdout.isTTY && !process.env.NO_COLOR;
}

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function paint(s: string, c: string): string {
  return useColor() ? `${c}${s}${C.reset}` : s;
}

// Every capsule-derived string below goes through `safeText` before it reaches
// stdout. A `summary` is attacker-chosen text; raw, its ANSI escapes could
// repaint the very output a human is reading to decide what went wrong.
function formatEvent(ev: TraceEvent): string {
  const where = `${paint(`t=${ev.t}`, C.gray)} ${paint(`seq=${ev.seq}`, C.gray)}`;
  switch (ev.kind) {
    case "timer":
      return `${where} ${paint("timer", C.blue)}${ev.nodeId ? " " + paint(safeText(ev.nodeId), C.cyan) : ""}`;
    case "wake":
      return `${where} ${paint("wake", C.blue)} ${paint(safeText(ev.nodeId), C.cyan)}`;
    case "send":
      return `${where} ${paint("send", C.yellow)} ${paint(safeText(ev.from), C.cyan)}→${paint(safeText(ev.to), C.cyan)} ${safeText(ev.summary)}`;
    case "deliver":
      return `${where} ${paint("deliver", C.green)} ${paint(safeText(ev.from), C.cyan)}→${paint(safeText(ev.to), C.cyan)} ${safeText(ev.summary)}`;
    case "crash":
      return `${where} ${paint("crash", C.red)} ${paint(safeText(ev.nodeId), C.red)}`;
    case "restart":
      return `${where} ${paint("restart", C.green)} ${paint(safeText(ev.nodeId), C.green)}`;
    case "partition":
      return `${where} ${paint("partition", C.magenta)} ${ev.groups.map((g) => `[${g.map((n) => safeText(n)).join(",")}]`).join(" | ")} healAt=${ev.healAt}`;
    case "invariant-violation":
      return `${where} ${paint("VIOLATION", C.red + C.bold)} ${paint(safeText(ev.name), C.red)} — ${safeText(ev.detail)}`;
    default:
      // Defensive fallback for unknown event kinds
      return `${where} ${paint(safeText((ev as { kind: string }).kind), C.bold)} ${safeText(JSON.stringify(ev))}`;
  }
}

/** Render a Trace as a header line plus one line per event (ordered by seq). */
export function formatTraceLines(trace: Trace): string[] {
  const nodes = trace.nodes.map((n) => paint(safeText(n), C.cyan)).join(", ");
  return [
    `${paint("seed", C.gray)} ${paint(safeText(trace.seed), C.bold)} | ${paint("nodes", C.gray)} ${nodes} | ${paint(safeText(trace.result), trace.result === "violation" ? C.red : C.green)} | ${trace.events.length} events`,
    ...trace.events.map(formatEvent),
  ];
}

export async function traceCommand(capsulePath: string): Promise<{ exitCode: number; lines: string[] }> {
  let capsule: FailureCapsule;
  try {
    capsule = await readCapsule(resolveCapsulePath(capsulePath));
  } catch (e) {
    return {
      exitCode: 2,
      lines: [capsuleReadError(capsulePath, e)],
    };
  }
  return { exitCode: 0, lines: formatTraceLines(capsule.trace) };
}
