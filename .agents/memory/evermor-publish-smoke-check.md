---
name: Evermor publish smoke check
description: How and why the Evermor frontend has a manual pre-publish build/asset-reference check
---

`artifacts/evermor/scripts/publish-smoke-check.mjs` (run via `pnpm --filter @workspace/evermor run smoke:publish`) rebuilds the frontend using the exact command/env read live from `.replit-artifact/artifact.toml`, wipes `dist/` first, then parses the built `index.html` and fails loudly if any referenced local asset (script/link `src`/`href`) is missing from the output.

**Why:** catches two regressions that are otherwise silent until a user hits a broken page: the production build step being skipped/misconfigured, and the root page shipping asset references that don't match what's actually on disk (stale files).

**How to apply:** the check is manual today (not wired into the actual publish flow) — see follow-up task on automatically gating publish on it. It re-parses `artifact.toml` on every run rather than hardcoding the build command, so keep using the real config as the source of truth if this script is extended.
