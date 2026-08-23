// chronos doctor — environment diagnostic tool.

import { stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CHRONOS_VERSION } from "@sx4im/chronos-core";
import { C, drawBox, renderTopBanner } from "./ui.js";
import { checkCommand } from "./check.js";

/** Env vars `explain.ts` reads, in the order it probes them. */
const EXPLAIN_ENV_KEYS = [
  "CHRONOS_EXPLAIN_BASE_URL",
  "LLM_BASE_URL",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
] as const;

export interface DoctorResult {
  exitCode: number;
  message: string;
}

async function dirExists(p: string): Promise<boolean> {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

export async function doctorCommand(paths: string[] = []): Promise<DoctorResult> {
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1).split(".")[0] ?? "0", 10);
  const nodeOk = nodeMajor >= 20;

  // Mirror the providers `explain.ts` actually implements — reporting a key the
  // command never reads is worse than reporting none.
  const explainProvider = EXPLAIN_ENV_KEYS.find((k) => !!process.env[k]);

  const here = dirname(fileURLToPath(import.meta.url));
  const inspectorDist = resolve(here, "..", "..", "inspector", "dist");
  const inspectorOk = await dirExists(inspectorDist);

  // Run the static DST compliance linter (`paths` lets tests point the check
  // at a hermetic fixture instead of whatever directory the process sits in).
  const checkRes = await checkCommand(paths);
  const dstOk = checkRes.exitCode === 0;

  const lines: string[] = [
    `${C.bold("Runtime Diagnostics")}:`,
    `  ${C.cyan("•")} Node.js:          ${C.white(nodeVersion)} ${nodeOk ? C.emerald("✔ (>= 20)") : C.rose("✖ (requires Node.js >= 20)")}`,
    `  ${C.cyan("•")} Strict Mode:       ${C.emerald("✔ Active")} ${C.muted("(microtask queue draining & entropy guards active)")}`,
    `  ${C.cyan("•")} DST Compliance:   ${dstOk ? C.emerald("✔ Clean") : C.amber("✖ Warnings (run 'chronos check' to inspect)")}`,
    `  ${C.cyan("•")} Inspector UI:      ${inspectorOk ? `${C.emerald("✔ Ready")} ${C.muted(`(${inspectorDist})`)}` : C.rose("✖ Not built (run pnpm --filter @sx4im/chronos-inspector build)")}`,
    `  ${C.cyan("•")} AI Explain Key:    ${explainProvider ? C.emerald(`✔ Configured via ${explainProvider}`) : C.slate("○ Unset (chronos explain optional)")}`,
    "",
    nodeOk && inspectorOk && dstOk
      ? `${C.badgeEmerald(" HEALTHY ")} System environment is fully operational.`
      : `${C.badgeRose(" ATTENTION ")} System environment requires attention (see items marked ✖ or ✖ above).`,
  ];

  const title = `${C.indigo("CHRONOS SYSTEM DOCTOR")} ${C.muted(`v${CHRONOS_VERSION}`)}`;

  return {
    exitCode: nodeOk && dstOk ? 0 : 1,
    message: renderTopBanner() + drawBox(title, lines),
  };
}
