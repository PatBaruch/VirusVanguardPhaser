# Feature Handoff

- Feature name: Player recovery window and damage-state feedback
- PR ID: PR-047
- REQ-ID: FR-002
- ARCH-ID: Phaser-GameScene-Player-Recovery
- IMPL-ID: Ralph-2026-03-15-pr-047-player-recovery
- TEST-ID list: TST-PLAYER-RECOVERY-HELPER, TST-PLAYER-STATE-RECOVERING, TST-E2E-PLAYER-RECOVERING-STATE
- Branch: `ralph-wave-j-e2e`
- PR: n/a
- Date: 2026-03-15

## What Changed
- Added a central recovery-window resolver so player damage is ignored while the short post-hit invulnerability timer is active.
- Extended gameplay status state resolution so the player exposes a deterministic `recovering` state for runtime verification.
- Kept damage feedback visible for the full recovery window by holding a lighter overlay after the initial hit flash ends.
- Added focused unit and Playwright coverage for recovery suppression and the surfaced recovering state, then re-ran the full required Ralph gates.

## Files Added or Modified
- Added:
  - `docs/handoffs/2026-03-15-pr-047-player-recovery-window-and-damage-state-feedback.md`
- Modified:
  - `.ralph/ralph-tasks.md`
  - `docs/architecture/phaser-migration.mmd`
  - `docs/parity/known-limitations.md`
  - `e2e/combat-interactions.spec.ts`
  - `src/phaser/scenes/GameScene.ts`
  - `src/phaser/scenes/gameplayStatus.spec.ts`
  - `src/phaser/scenes/gameplayStatus.ts`
- Deleted:
  - none

## Test Coverage Summary
- Unit tests added or updated:
  - `src/phaser/scenes/gameplayStatus.spec.ts`
- Runtime tests added or updated:
  - `e2e/combat-interactions.spec.ts`
- Full suite status:
  - build/lint/unit/e2e passing on latest verification

## Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/gameplayStatus.spec.ts`
- `npx playwright test e2e/combat-interactions.spec.ts -g "surfaces a recovering player state after taking combat damage"`
- `npm run build`
- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`

## Quality Gate Results
- Static gate: PASS
- Behavioral gate: PASS
- Runtime gate: PASS
- Documentation gate: PASS

## Failure Loop Notes
- Root cause hypothesis 1:
  - Focused Playwright recovery coverage was failing before gameplay because this worktree did not have `phaser` installed locally, so `index.html` hit a 404 for `./node_modules/phaser/dist/phaser.esm.js`.
- Fix applied 1:
  - Ran `npm ci` to restore the local browser runtime dependency tree before continuing verification.
- Root cause hypothesis 2:
  - The first recovery implementation made the full recovery window testable through `vvPlayerState`, but the visible red overlay ended too early to count as sustained damage-state feedback.
- Fix applied 2:
  - Kept a lighter overlay visible through the remaining recovery window after the initial flash expires.
- Re-run evidence:
  - Focused unit coverage passed, focused recovery Playwright coverage passed after the overlay adjustment, and the full build/lint/unit/e2e suite passed afterward.

## Known Edge Cases and Limitations
- The recovery window is a fixed first-pass duration (`450ms`) and may need future tuning alongside later encounter-design PRs.
- This PR only adds fairness/damage-state feedback; onboarding, exit-open messaging, and encounter rules remain for later Wave I PRs.

## Requirement Traceability
- `FR-002 Damage Recovery Window` -> `src/phaser/scenes/gameplayStatus.ts`, `src/phaser/scenes/GameScene.ts`
- `SC-004 Close-range contact stacks cannot drain multiple chunks inside the same short recovery window` -> `src/phaser/scenes/gameplayStatus.spec.ts`
- `SC-005 Player recovery state is visible during runtime validation` -> `e2e/combat-interactions.spec.ts`, `src/phaser/scenes/GameScene.ts`

## Next Recommended PR
- Next PR ID: PR-048
- Rationale:
  - Fairness feedback is now in place, so the next narrow improvement is clearer control onboarding, exit-open messaging, and enemy-hit confirmation.
- Dependencies:
  - none
