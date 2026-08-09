// Vite config for the Chronos Inspector (Phase 4.1–4.2) — a pure client-side
// React app that loads a failure capsule's `trace` JSON (file picker, drag-drop,
// or a `?capsule=` URL param preloaded by `chronos open`) and renders a
// time-travel timeline + message-sequence diagram. No backend.
//
// The `@sx4im/chronos-core` alias points at core's SOURCE so a dev/build never depends
// on core being pre-built. The inspector must import core for TYPES ONLY — those
// are elided, so no node polyfills are needed. Importing a runtime VALUE from
// core instead pulls in core's whole barrel, including `env.ts`'s
// `node:async_hooks`, which does not exist in a browser and fails the build.
// `__CHRONOS_VERSION__` below exists so displaying the version does not require
// that import.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read core's version at build time — the same single source of truth
// CHRONOS_VERSION is pinned to — rather than hardcoding it in the UI, which is
// how it came to read "v0.0.0" long after the packages shipped 0.1.5.
const corePkg = JSON.parse(
  readFileSync(path.resolve(__dirname, "../core/package.json"), "utf8"),
) as { version: string };

export default defineConfig({
  plugins: [react()],
  define: {
    __CHRONOS_VERSION__: JSON.stringify(corePkg.version),
  },
  resolve: {
    alias: {
      "@sx4im/chronos-core": path.resolve(__dirname, "../../packages/core/src/index.ts"),
    },
  },
  build: {
    outDir: "dist",
    // Source maps are published alongside the bundle on the hosted Inspector,
    // which hands anyone the full unminified source tree and any comment or
    // path in it. Keep them for local debugging (`vite build` during dev, or an
    // explicit CHRONOS_SOURCEMAP=1) and off for the deployed build.
    sourcemap: process.env.CHRONOS_SOURCEMAP === "1" || process.env.NODE_ENV === "development",
  },
});
