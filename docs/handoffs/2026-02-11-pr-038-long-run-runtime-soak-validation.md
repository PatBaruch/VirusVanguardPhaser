# Feature Handoff
- Feature name: Long-run runtime soak validation (no console/page errors under sustained input)
- PR ID: PR-038
- REQ-ID: PRD-9-PR-038
- ARCH-ID: ARCH-PHASER-E2E-RUNTIME-SOAK
- IMPL-ID: IMPL-PR-038-PLAYWRIGHT-RUNTIME-SOAK
- TEST-ID list: TEST-PR-038-RUNTIME-SOAK-E2E, TEST-PR-038-STATIC-BUILD, TEST-PR-038-STATIC-LINT, TEST-PR-038-UNIT-FULL-SUITE, TEST-PR-038-RUNTIME-E2E
- Branch: current working branch
- PR: pending
- Date: 2026-02-11

# What Changed
- Added a new Playwright soak test that drives sustained keyboard input over an extended runtime window and verifies zero browser console errors and zero page-level runtime exceptions.
- Implemented deterministic scene setup through the existing `/?e2e=1` runtime hook so the soak starts directly in Level1 walkable state and repeatedly exercises movement plus shoot input.
- Updated migration architecture and known-limitations documents to record PR-038 runtime-soak evidence coverage.

# Files Added/Modified
- Added:
  - `e2e/runtime-soak.spec.ts`
  - `docs/handoffs/2026-02-11-pr-038-long-run-runtime-soak-validation.md`
- Modified:
  - `.ralph/ralph-tasks.md`
  - `docs/architecture/phaser-migration.mmd`
  - `docs/parity/known-limitations.md`
- Deleted:
  - None.

# Test Coverage Summary
- Unit tests added/updated:
  - None.
- Parity tests added/updated:
  - None.
- Runtime tests added/updated:
  - Added `e2e/runtime-soak.spec.ts` to validate sustained runtime stability under repeated movement and shoot input without console/page errors.
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
  - Handoff created and architecture/known-limitations docs updated for PR-038 evidence.

# Exact Verification Commands Run
- `npm run test:e2e -- e2e/runtime-soak.spec.ts` (red, then green after minimal assertion fix)
- `npm run build` (green)
- `npm run lint` (green)
- `npm run test:unit` (green)
- `npm run test:e2e` (green)

# Known Edge Cases and Limitations
- Edge cases:
  - Soak flow uses deterministic in-test scene setup and direct Level1 walkable-state forcing through the gated e2e runtime hook.
- Limitations:
  - This soak validates browser error stability signals (console/page errors) and finite player-state continuity, not FPS or memory telemetry thresholds.
- Risk notes:
  - The `__VV_E2E_RUNTIME__` hook remains gated behind `?e2e=1` and is not active in normal runtime mode.

# Parity Confirmation
- Parity scope confirmed:
  - Wave G PR-038 scope is covered by sustained-input runtime validation with explicit zero-error assertions across browser console and page runtime channels.
- Evidence links:
  - `e2e/runtime-soak.spec.ts`
  - `docs/architecture/phaser-migration.mmd`
  - `docs/parity/known-limitations.md`
- Remaining parity gaps:
  - PR-039 traceability artifact validation/repair and PR-040 CI required merge checks.

# Next Recommended PR
- Next PR ID: PR-039
- Rationale:
  - With traversal, combat interactions, and runtime soak coverage in place, the next locked scope is end-to-end traceability artifact validation and repair.
- Dependencies:
  - Existing handoffs, parity matrix, architecture, and known-limitations docs generated across PR-001 to PR-038.
