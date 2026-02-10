# Feature Handoff

- Feature name: Shared constants parity table (movement, bounds, timers)
- PR ID: PR-003
- REQ-ID: REQ-PHASER-SHARED-CONSTANTS-PARITY
- ARCH-ID: ARCH-PHASER-CONSTANTS-PARITY-TABLE
- IMPL-ID: IMPL-PR-003-CONSTANTS-TABLE
- TEST-ID list: TEST-STATIC-BUILD, TEST-STATIC-TSC-NOEMIT
- Branch: current working branch
- PR: N/A (local iteration handoff)
- Date: 2026-02-11

## What Changed
- Added a shared Phaser constants table that captures legacy parity values for movement speed, diagonal normalization, per-level bounds ratios, transition gate bounds, score thresholds, and timer intervals.
- Kept changes configuration-only so later PRs can consume the constants without changing gameplay behavior in this slice.
- Updated architecture and known limitations docs to reflect the new constants layer and the remaining wiring gap.

## Files Added or Modified
- Added:
  - `src/phaser/config/parityConstants.ts`
  - `docs/handoffs/2026-02-11-pr-003-shared-constants-parity-table.md`
- Modified:
  - `docs/parity/known-limitations.md`
  - `docs/architecture/phaser-migration.mmd`
  - `.ralph/ralph-tasks.md`
- Deleted:
  - None

## Verification Commands Run
- `npm run build`
- `npx tsc --noEmit`

## Quality Gate Results
- Static gate: PASS (`npm run build`, `npx tsc --noEmit`)
- Behavioral gate: N/A for PR-003 staged profile (unit/parity scripts not introduced yet)
- Runtime gate: N/A for PR-003 staged profile (e2e script not introduced yet)
- Documentation gate: PASS (handoff + architecture + limitations updated)

## Failure Loop Notes
- No gate failures occurred in this iteration.

## Known Edge Cases and Limitations
- Constants are defined but not yet consumed by Phaser scene/entity logic.
- Parity behavior remains incomplete until follow-up PRs wire movement, bounds checks, transitions, and timers to this table.

## Parity Confirmation
- Scope confirmed: shared constants parity table only.
- Evidence: `src/phaser/config/parityConstants.ts` contains legacy-derived movement, bounds, transition, score threshold, and timer constants.
- Remaining parity gaps: gameplay systems, asset preload, and runtime parity wiring across movement/combat/enemy/boss flows.

## Next Recommended PR
- Next PR ID: PR-004
- Rationale: establish ESLint config and lint gate baseline so subsequent PRs can enforce static quality checks.
- Dependencies: PR-003 complete.
