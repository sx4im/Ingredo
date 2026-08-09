# Security Policy

## Reporting a vulnerability

Please report security issues privately via [GitHub Security Advisories](https://github.com/sx4im/chronos/security/advisories/new) rather than a public issue.

## The threat model

Chronos is a developer tool. It runs on developer laptops and CI runners, and it has no server component and no user accounts. That shapes what "a vulnerability" means here.

### A failure capsule is untrusted input

This is the load-bearing assumption. A capsule (`.chronos/failures/<seed>.json`) exists to be **shared** — attached to a GitHub issue, produced by someone else's CI, handed to a teammate — and then opened with `chronos trace`, `chronos stats`, `chronos export`, `chronos replay`, or the Inspector.

So a capsule is treated exactly like a file downloaded from a stranger:

- **Everything is validated at the read boundary.** `readCapsule` caps the file size before reading (128 MB; `CHRONOS_MAX_CAPSULE_BYTES` raises it), rejects a `__proto__` key at the parse boundary, and validates the whole structure — including every trace event against the `TraceEvent` union — before any field reaches the `Simulator` or a renderer. A malformed capsule produces a clear `InvalidCapsule` error, never a crash and never a partially-applied config.
- **Errors never echo capsule bytes.** Node's `JSON.parse` `SyntaxError` embeds the offending file contents, which on a misdirected `chronos replay /etc/passwd` would disclose that file. All capsule read errors are content-free.
- **Capsule paths are confined.** By default, capsules and scenarios must live under the working directory, `CHRONOS_DIR`, or `CHRONOS_CAPSULE_DIR`. Set `CHRONOS_ALLOW_OUTSIDE_CAPSULES=1` to opt out. Importing a scenario *executes* it, so `replay`, `shrink`, and `sweep` all apply this.
- **Capsule text is escaped per output sink.** Capsule strings are attacker-chosen, and each renderer feeds a sink with its own injection grammar: terminal escape sequences are stripped before printing (a trace viewer that can be made to repaint its own output can lie about what it found), CSV cells are prefixed against spreadsheet formula injection, and Markdown cells are escaped against table breakout.
- **The Inspector bounds what it draws.** Events that don't match the `TraceEvent` union are dropped, and event count, node count, and the laid-out time span are all capped — with any truncation shown in the UI, so a partial trace is never presented as a complete one.

### `chronos open` serves only to localhost

The Inspector server binds `127.0.0.1`, requires a loopback `Host` header (blocking DNS rebinding), confines file serving to the built `dist/`, and sends a restrictive CSP plus `X-Frame-Options: DENY`. The `?capsule=` parameter accepts only same-origin absolute paths, so a crafted link cannot make your browser fetch a cross-origin URL on your behalf.

### `chronos explain` is optional and isolated

It is the only feature that makes a network call, it is off unless you set a key, and it is absent from `@sx4im/chronos-core` entirely. Your API key is sent as a header (never in a URL, where proxies and access logs would retain it), only over `https` unless the endpoint is loopback. The capsule summary is redacted for JWTs and `token=`/`key=`/`secret=`/`password=` values before it is sent, and the model's reply is sanitized before it is printed — a capsule shapes that prompt, so the reply is the exit of a prompt-injection path.

### Determinism is a security property

Chronos removes every source of entropy from a simulated run. `@sx4im/chronos-core` has **zero runtime dependencies**, which keeps the supply chain for the part that runs inside your test process as small as it can be.

Note the asymmetry between the two environments:

- **`SimEnv` (tests)** draws from the seeded xoshiro256\*\* PRNG. It is deterministic by design and therefore **completely predictable** — never use `env.random()` from a simulated run as a source of secrets.
- **`RealEnv` (production)** backs `env.random()` with a CSPRNG. The same application code may reasonably use `env.random()` for a request id or a nonce in production, so the production adapter must be safe for that; nothing in production is replayed, so this costs nothing.

### Out of scope

- A malicious *scenario module*. `chronos sweep`/`replay`/`shrink` import and run your scenario, which is your own code — the path confinement is a guard against a mistyped path, not a sandbox.
- The contents of your own source tree, which `chronos check` reads.
- Denial of service from a sweep you asked for. Seed counts are capped at 1,000,000 to keep a typo from exhausting memory, but a large sweep is meant to be expensive.
