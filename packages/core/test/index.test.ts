import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { CHRONOS_VERSION } from "../src/index.js";

describe("@sx4im/chronos-core version", () => {
  it("exports a semver version string", () => {
    expect(CHRONOS_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  // CHRONOS_VERSION is stamped into every capsule and rendered by the CLI and
  // the Inspector. Drift from package.json makes a capsule claim a version that
  // never existed, so pin them together here rather than by convention.
  it("matches the package.json version", () => {
    const pkgUrl = new URL("../package.json", import.meta.url);
    const pkg = JSON.parse(readFileSync(fileURLToPath(pkgUrl), "utf8")) as { version: string };
    expect(CHRONOS_VERSION).toBe(pkg.version);
  });
});
