// The version the Inspector displays.
//
// It cannot come from `@sx4im/chronos-core`: the inspector imports core for
// TYPES ONLY (which are elided at build time), and importing a runtime value
// would pull core's whole barrel — including `env.ts`'s `node:async_hooks` —
// into a browser bundle, where it does not exist. So Vite injects core's
// package.json version as `__CHRONOS_VERSION__` at build time instead. Same
// single source of truth, no runtime import.
//
// The fallback covers non-Vite consumers of this module (the Vitest unit tests
// run without the `define`).

declare const __CHRONOS_VERSION__: string | undefined;

export const CHRONOS_VERSION: string =
  typeof __CHRONOS_VERSION__ === "string" ? __CHRONOS_VERSION__ : "0.0.0-dev";
