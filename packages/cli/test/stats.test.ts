// Tests for the `--json` output mode of `chronos stats` / `chronos replay`
// (issue #24). CI pipelines need machine-readable output for `jq` and
// dashboards, so the JSON path must be pure JSON — no banner, no ANSI, no
// trailing prose — and keep the same exit codes as the human-readable path.

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { runSimTest } from "@sx4im/chronos-vitest/engine";
import { statsCommand } from "../src/stats.js";
import { replayCommand } from "../src/replay.js";
import { runCommand } from "../src/index.js";
import { body, netFactory, nodes } from "./fixtures/counterScenario.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureFaulty = path.resolve(__dirname, "fixtures/counterScenario.ts");
const ANSI = /\u001b\[/;

let dir: string;
let capsulePath: string;
let prevChronosDir: string | undefined;

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), "chronos-json-"));
  prevChronosDir = process.env.CHRONOS_DIR;
  process.env.CHRONOS_DIR = dir;
  const out = await runSimTest({ seeds: 100, nodes, netFactory, chronosDir: dir }, body);
  expect(out.violated).toBe(true);
  capsulePath = out.capsulePath!;
});

afterAll(() => {
  if (prevChronosDir === undefined) delete process.env.CHRONOS_DIR;
  else process.env.CHRONOS_DIR = prevChronosDir;
  rmSync(dir, { recursive: true, force: true });
});

describe("chronos stats --json", () => {
  it("emits pure, parseable JSON with no ANSI codes", async () => {
    const r = await statsCommand(capsulePath, { json: true });
    expect(r.exitCode).toBe(0);
    expect(r.message).not.toMatch(ANSI);
    expect(r.message.trimStart().startsWith("{")).toBe(true);
    expect(r.message.trimEnd().endsWith("}")).toBe(true);

    const parsed = JSON.parse(r.message) as {
      seed: unknown;
      nodes: string[];
      result: string;
      eventCount: number;
      eventCounts: Record<string, number>;
      network: { sent: number; delivered: number; latencyMs: { avg: number } };
      invariant?: { name: string; detail: string };
    };
    expect(parsed.seed).toBeDefined();
    expect(parsed.nodes.length).toBeGreaterThan(0);
    expect(parsed.result).toBe("violation");
    expect(parsed.eventCount).toBeGreaterThan(0);
    expect(parsed.eventCounts.send).toBeGreaterThan(0);
    expect(parsed.network.sent).toBeGreaterThan(0);
    expect(parsed.network.delivered).toBeGreaterThan(0);
    expect(parsed.network.latencyMs.avg).toBeGreaterThanOrEqual(0);
    expect(parsed.invariant?.name).toContain("all counts equal");
  });

  it("is wired through the argv dispatcher", async () => {
    const r = await runCommand("stats", [capsulePath, "--json"]);
    expect(r.code).toBe(0);
    expect(r.out).toBeDefined();
    expect(r.out).not.toMatch(ANSI);
    expect(() => JSON.parse(r.out!)).not.toThrow();
  });

  it("keeps the human-readable box without --json", async () => {
    const r = await statsCommand(capsulePath);
    expect(r.exitCode).toBe(0);
    expect(r.message).toContain("CHRONOS TRACE STATS");
  });
});

describe("chronos replay --json", () => {
  it("emits a structured summary when a scenario reproduces the failure", async () => {
    const r = await replayCommand(capsulePath, fixtureFaulty, { json: true });
    expect(r.exitCode).toBe(0);
    expect(r.reproduced).toBe(true);
    expect(r.message).not.toMatch(ANSI);

    const parsed = JSON.parse(r.message) as {
      seed: unknown;
      recordedResult: string;
      events: number;
      reproduced: boolean;
      scenario: string | null;
      rerun: { result: string; events: number } | null;
    };
    expect(parsed.seed).toBeDefined();
    expect(parsed.recordedResult).toBe("violation");
    expect(parsed.events).toBeGreaterThan(0);
    expect(parsed.reproduced).toBe(true);
    expect(parsed.scenario).toBe(fixtureFaulty);
    expect(parsed.rerun?.result).toBe("violation");
    expect(parsed.rerun?.events).toBe(parsed.events);
  });

  it("emits a structured summary without a scenario (no reproduction)", async () => {
    const r = await replayCommand(capsulePath, undefined, { json: true });
    expect(r.exitCode).toBe(0);
    expect(r.reproduced).toBe(false);
    const parsed = JSON.parse(r.message) as {
      recordedResult: string;
      reproduced: boolean;
      scenario: string | null;
      rerun: unknown;
    };
    expect(parsed.recordedResult).toBe("violation");
    expect(parsed.reproduced).toBe(false);
    expect(parsed.scenario).toBeNull();
    expect(parsed.rerun).toBeNull();
  });

  it("emits a parseable error object for an unreadable capsule", async () => {
    const r = await replayCommand(join(dir, "nope.json"), undefined, { json: true });
    expect(r.exitCode).toBe(2);
    const parsed = JSON.parse(r.message) as { error: string };
    expect(parsed.error).toContain("could not read capsule");
  });
});
