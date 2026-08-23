import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@sx4im/chronos-core": path.resolve(__dirname, "packages/core/src/index.ts"),
      "@sx4im/chronos-net": path.resolve(__dirname, "packages/net/src/index.ts"),
      "@sx4im/chronos-vitest/engine": path.resolve(
        __dirname,
        "packages/vitest/src/engine.ts"
      ),
      "@sx4im/chronos-vitest": path.resolve(
        __dirname,
        "packages/vitest/src/index.ts"
      ),
    },
  },
  test: {
    include: ["packages/*/test/**/*.test.ts", "examples/*/**/*.test.ts"],
    testTimeout: 30_000,
    // The default "forks" pool crashes on Node >=24 (tinypool stack overflow
    // during worker teardown). Worker threads are unaffected, and Chronos tests
    // don't rely on process-level isolation.
    pool: "threads",
    coverage: {
      provider: "v8",
      // Source-only: node_modules and dist are excluded by default; tests and
      // example SUTs are not "the library" and would inflate the numbers.
      include: ["packages/*/src/**"],
      exclude: ["packages/inspector/src/**", "**/*.d.ts"],
      thresholds: {
        // Enforced floors, not aspirations — `pnpm test:coverage` fails below
        // these. Lines/functions are held high; branches stay a notch lower
        // until the guard-heavy error paths get dedicated cases.
        lines: 85,
        functions: 85,
        branches: 75,
        statements: 85,
      },
    },
  },
});
