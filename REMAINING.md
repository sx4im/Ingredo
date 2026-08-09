# Chronos Remaining Tasks / Issues

This document tracks any outstanding bugs, tasks, or issues remaining in the **Chronos** deterministic simulation testing framework.

## Outstanding Issues

- **None** for code quality (tests/typecheck/lint/build).
- **Outreach follow-ups (human):** from a personal GitHub account, open listing PRs using [`docs/outreach/`](./docs/outreach/README.md) patches (or wait for maintainers on the suggestion issues). Close accidental probe [dastergon/awesome-chaos-engineering#205](https://github.com/dastergon/awesome-chaos-engineering/issues/205). Wait for ~100 stars before Best of JS / awesome-nodejs.

## Code Quality Status

- **Unit and Simulation Tests**: 256/256 passing.
- **TypeScript Typecheck**: Clean (0 compilation errors).
- **ESLint**: Clean (0 warnings or errors).
- **Build**: All workspace packages compile (ESM + type declarations).

## Security Posture

A full audit of every package was completed against the categories in the
[vibe-security](https://github.com/raroque/vibe-security-skill) checklist, and
every finding is fixed with a regression test. See [`SECURITY.md`](./SECURITY.md)
for the threat model — the central assumption is that **a failure capsule is
untrusted input**, because it is designed to be shared.

Closed in that pass:

| Area | Issue |
| --- | --- |
| Core | The strict-mode `setTimeout` guard compiled string handlers via `new Function` — an eval sink Node itself does not have |
| CLI | Untrusted capsule text reached the terminal unescaped (ANSI/OSC injection could repaint the trace viewer's own output) |
| CLI | `chronos export --csv` allowed spreadsheet formula injection; Markdown export allowed table breakout |
| CLI | The Gemini API key was sent in a URL query string; the interactive key prompt echoed in the clear |
| CLI | `chronos check` followed symlinks and recursed forever on a cycle; `sweep` imported scenarios from any path |
| Capsules | No file-size limit before read; no `__proto__` rejection; predictable temp filename on write; trace events unvalidated |
| Inspector | Malformed events crashed the render; event count, node count, and time span were unbounded |
| Deployment | No security headers on the hosted Inspector; source maps published; CI ran with default (write) token permissions |

## Known Non-Goals

- `@sx4im/chronos-core` keeps **zero runtime dependencies**. Do not add any.
- The BigInt PRNG is the known hot path. It stays pure TypeScript until the
  planned Rust/WASM phase, which will keep pure TS as the default.
