// replayTest (§4.4) — re-run a saved capsule as a focused Vitest test.
//
// `replayCapsule` lives in `./engine.ts` (vitest-free) so the `@sx4im/chronos-cli` bin
// can reuse the exact same reproduction logic without importing Vitest. This
// module is the thin Vitest `test()` wrapper over it.
//
// The assertions themselves live in the exported pure `assertReplay` so the
// wrapper is testable without driving Vitest's own runner programmatically.

import { test, expect } from "vitest";
import type { SimTestBody } from "./types.js";
import type { NetworkFactory } from "@sx4im/chronos-core";
import { replayCapsule } from "./engine.js";
import { readCapsule } from "./capsule.js";

/** Assert that `capsulePath` records a violation and — when `body` is given —
 *  that the violation REPRODUCES bit-identically. Throws on any failure; safe
 *  to call outside a registered test. */
export async function assertReplay(
  capsulePath: string,
  body?: SimTestBody,
  netFactory?: NetworkFactory,
): Promise<void> {
  const capsule = await readCapsule(capsulePath);
  expect(capsule.trace.result).toBe("violation");

  if (!body) {
    // Smoke: capsule loads and records a violation.
    expect(capsule.invariant.name).toBeTruthy();
    return;
  }

  const { reproduced, violation, trace } = await replayCapsule(
    capsulePath,
    body,
    netFactory,
  );
  expect(violation).toBeDefined();
  expect(violation?.name).toBe(capsule.invariant.name);
  expect(reproduced).toBe(true);
  expect(trace.events).toEqual(capsule.trace.events);
}

/** Register a Vitest test that replays `capsulePath`. */
export function replayTest(
  capsulePath: string,
  body?: SimTestBody,
  netFactory?: NetworkFactory,
): void {
  test(`replay ${capsulePath}`, async () => {
    await assertReplay(capsulePath, body, netFactory);
  });
}
