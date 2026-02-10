# Feature Handoff

- Feature name: Playwright setup + boot smoke + console-error guard
- PR ID: PR-006
- REQ-ID: REQ-PHASER-RUNTIME-GATE-E2E
- ARCH-ID: ARCH-QUALITY-RUNTIME-E2E-GATE
- IMPL-ID: IMPL-PR-006-PLAYWRIGHT-BOOT-SMOKE
- TEST-ID list: TEST-E2E-BOOT-SMOKE, TEST-E2E-CONSOLE-ERROR-GUARD
- Branch: current working branch
- PR: N/A (local iteration handoff)
- Date: 2026-02-11

## What Changed
- Added Playwright as the runtime e2e harness and wired `npm run test:e2e` in `package.json`.
- Added Playwright configuration with a local web server to host `index.html` during e2e runs.
- Added `e2e/boot-smoke.spec.ts` to verify Phaser runtime boot via `?runtime=phaser` and enforce zero browser console/page errors.
- Added an import map in `index.html` so browser ESM resolves the `phaser` bare module specifier at runtime.
- Updated `AGENTS.md` with Playwright/e2e command guidance for the staged runtime gate.

## Files Added or Modified
- Added:
  - `e2e/boot-smoke.spec.ts`
  - `playwright.config.ts`
  - `scripts/e2e/static-server.mjs`
  - `docs/handoffs/2026-02-11-pr-006-playwright-setup-boot-smoke-console-guard.md`
- Modified:
  - `package.json`
  - `package-lock.json`
  - `index.html`
  - `.gitignore`
  - `AGENTS.md`
  - `.ralph/ralph-tasks.md`
- Deleted:
  - None

## Verification Commands Run
- `npm run test:e2e` (RED check: missing script)
- `npm run test:e2e` (failed: missing Playwright browser executable)
- `npx playwright install chromium`
- `npm run test:e2e` (failed: browser module resolution for bare `phaser` import)
- `npm run test:e2e` (GREEN after import map fix)
- `npm run build && npm run lint && npm run test:unit && npm run test:e2e`

## Quality Gate Results
- Static gate: PASS (`npm run build`, `npm run lint`)
- Behavioral gate: PASS (`npm run test:unit`)
- Runtime gate: PASS (`npm run test:e2e`)
- Documentation gate: PASS (handoff generated; architecture and known limitations unchanged)

## Failure Loop Notes
- Root cause 1: e2e gate could not start because `test:e2e` script was missing; fixed by wiring Playwright test script/config.
- Root cause 2: Playwright Chromium executable was absent in local cache; fixed by installing browser binaries with `npx playwright install chromium`.
- Root cause 3: Browser runtime failed to resolve bare module `phaser`; fixed with an import map in `index.html` targeting `./node_modules/phaser/dist/phaser.esm.js`.

## Known Edge Cases and Limitations
- Playwright browser binaries must be installed in the execution environment (`npx playwright install chromium`) before first e2e run.
- Boot smoke currently verifies load and error cleanliness only; scene interaction parity is deferred to later PRs.

## Parity Confirmation
- Scope confirmed: runtime e2e harness, Phaser boot smoke test, and console-error guard.
- Evidence: `playwright.config.ts`, `e2e/boot-smoke.spec.ts`, and passing `npm run test:e2e` output.
- Remaining parity gaps: gameplay movement, transitions, shooting, enemies, and boss systems remain in later PRs.

## Next Recommended PR
- Next PR ID: PR-007
- Rationale: complete docs scaffolding and parity documentation governance for ongoing micro-PR execution.
- Dependencies: PR-006 complete.
