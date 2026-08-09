# Awesome-list & directory outreach

Chronos visibility kit: ready-made entries, patches, and issue/PR copy for curated lists that fit Deterministic Simulation Testing, chaos/network simulation, and Vitest.

The cloud agent GitHub App **cannot fork external repos**, so listing PRs must be opened from a personal account (`sx4im` or a maintainer). Use the patches below, or point maintainers at the suggestion issues.

## Status (2026-08-09)

| Target | Stars | Fit | Suggestion issue | Notes |
|--------|------:|-----|------------------|-------|
| [ivanyu/awesome-deterministic-simulation-testing](https://github.com/ivanyu/awesome-deterministic-simulation-testing) | ~370 | Best | [#9](https://github.com/ivanyu/awesome-deterministic-simulation-testing/issues/9) | Software section (after Antithesis alphabetically) |
| [asatarin/testing-distributed-systems](https://github.com/asatarin/testing-distributed-systems) | ~2.6k | Excellent | [#24](https://github.com/asatarin/testing-distributed-systems/issues/24) | Tools / Deterministic Simulation |
| [dastergon/awesome-chaos-engineering](https://github.com/dastergon/awesome-chaos-engineering) | ~6.6k | Strong | [#206](https://github.com/dastergon/awesome-chaos-engineering/issues/206) | Notable Tools (bottom of category). Please also close accidental probe [#205](https://github.com/dastergon/awesome-chaos-engineering/issues/205). |
| [theanalyst/awesome-distributed-systems](https://github.com/theanalyst/awesome-distributed-systems) | ~12k | Good | [#69](https://github.com/theanalyst/awesome-distributed-systems/issues/69) | Verification of Distributed Systems |
| [porada/awesome-vitest](https://github.com/porada/awesome-vitest) | ~36 | Good | [#44](https://github.com/porada/awesome-vitest/issues/44) | Integrations, alphabetical `@sx4im/chronos-vitest` |

### Wait until ~100 stars

| Target | Why wait |
|--------|----------|
| [sindresorhus/awesome-nodejs](https://github.com/sindresorhus/awesome-nodejs) | Requires **100+ stars** and 30+ days |
| [michaelrambeau/bestofjs](https://github.com/michaelrambeau/bestofjs) (Best of JS) | Requires **100+ stars** |
| [aharris88/awesome-cli-apps](https://github.com/aharris88/awesome-cli-apps) | Requires **20+ stars** + 3 months; AI PRs unwelcome |

### Do not submit

| Target | Why |
|--------|-----|
| [dzharii/awesome-typescript](https://github.com/dzharii/awesome-typescript) | Explicit ban on LLM/AI-generated PRs |

## Canonical Chronos blurb

- **Repo:** https://github.com/sx4im/chronos
- **Docs:** https://docs-site-chronos.vercel.app/
- **npm:** `@sx4im/chronos-core`, `@sx4im/chronos-vitest`, `@sx4im/chronos-cli`
- **One-liner:** Deterministic Simulation Testing for Node.js and TypeScript — seeded PRNG, virtual clock, simulated network chaos, Vitest integration, bit-identical replay from a single seed.

## How to open the PRs (human, ~10 minutes)

```bash
# Example: DST awesome list
gh repo fork ivanyu/awesome-deterministic-simulation-testing --clone
cd awesome-deterministic-simulation-testing
git checkout -b add-chronos
# apply patch from patches/ or edit README by hand using entries.md
git add README.md
git commit -m "Add Chronos to Software section"
git push -u origin add-chronos
gh pr create --title "Add Chronos (DST for Node.js/TypeScript)" --body-file ../chronos/docs/outreach/pr-bodies/ivanyu.md
```

Repeat for the other repos using files under `patches/` and `pr-bodies/`.

## Contributor magnets (after listings land)

1. Keep `good first issue` / `help wanted` labels on Chronos issues.
2. Add Chronos to [Up For Grabs](https://up-for-grabs.net/) / [First Timers Only](https://www.firsttimersonly.com/) once labeled issues exist.
3. At 100 stars: submit Best of JS + awesome-nodejs (Testing / Mad science as appropriate).
