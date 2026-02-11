# Feature Handoff
- Feature name: Switch default runtime to Phaser and retain legacy fallback flag
- PR ID: PR-034
- REQ-ID: PRD-9-PR-034
- ARCH-ID: ARCH-PHASER-RUNTIME-CUTOVER
- IMPL-ID: IMPL-PR-034-DEFAULT-PHASER-RUNTIME
- TEST-ID list: TEST-PR-034-RUNTIME-MODE-UNIT, TEST-PR-034-STATIC-BUILD, TEST-PR-034-STATIC-LINT, TEST-PR-034-UNIT-FULL-SUITE, TEST-PR-034-RUNTIME-E2E
- Branch: current working branch
- PR: pending

# What Changed
- Switched runtime selection behavior so Phaser is now the default when no runtime query parameter is present.
- Retained explicit legacy fallback via `?runtime=legacy` while preserving explicit `?runtime=phaser` support.
- Updated runtime smoke coverage to validate default boot path and refreshed migration docs to reflect the cutover state.

# Files Added/Modified
- Added:
  - `src/runtime/RuntimeMode.spec.ts`
  - `docs/handoffs/2026-02-11-pr-034-switch-default-runtime-to-phaser-retain-legacy-fallback.md`
- Modified:
  - `src/runtime/RuntimeMode.ts`
  - `e2e/boot-smoke.spec.ts`
  - `docs/parity/known-limitations.md`
  - `docs/parity/parity-matrix.md`
  - `docs/architecture/phaser-migration.mmd`
  - `build/runtime/RuntimeMode.js`
  - `build/runtime/RuntimeMode.js.map`
  - `.ralph/ralph-tasks.md`
- Deleted:
  - None

# Test Coverage Summary
- Unit tests added/updated:
  - Added `src/runtime/RuntimeMode.spec.ts` for default Phaser selection and legacy/phaser query override behavior.
- Parity tests added/updated:
  - None.
- Runtime tests added/updated:
  - Updated `e2e/boot-smoke.spec.ts` to verify default runtime boot from `/` instead of `/?runtime=phaser`.
- Full suite status:
  - Passing.

# Quality Gate Results
- Static Gate: PASS
  - `npm run build`
  - `npm run lint`
- Behavioral Gate: PASS
  - `npm run test:unit`
- Runtime Gate: PASS
  - `npm run test:e2e`
- Documentation Gate: PASS
  - Handoff created and migration docs updated for runtime cutover behavior.

# Exact Verification Commands Run
- `npm run test:unit -- src/runtime/RuntimeMode.spec.ts`
- `npm run build`
- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`

# Known Edge Cases and Limitations
- Edge cases:
  - Unknown `runtime` query values continue to fall back to the default Phaser runtime.
- Limitations:
  - Legacy runtime is still present and reachable via `?runtime=legacy` until PR-035 removes it.
- Risk notes:
  - Legacy fallback remains user-accessible by URL, so decommission scope in PR-035 must remove both selector path and legacy runtime wiring together.

# Parity Confirmation
- Parity scope confirmed:
  - Runtime selection parity governance moved to Phaser-default cutover with explicit legacy fallback retained.
- Evidence links:
  - `src/runtime/RuntimeMode.ts`
  - `src/runtime/RuntimeMode.spec.ts`
  - `e2e/boot-smoke.spec.ts`
  - `docs/parity/known-limitations.md`
  - `docs/architecture/phaser-migration.mmd`
- Remaining parity gaps:
  - PR-035 legacy runtime decommission only.

# Next Recommended PR
- Next PR ID: PR-035
- Rationale:
  - Default cutover is complete; remaining Wave F work is removal of legacy runtime after stable-cycle acceptance.
- Dependencies:
  - Requires validating no P0/P1 regressions in Phaser-default mode before removing legacy fallback path.
