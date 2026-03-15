# Feature Handoff

- Feature name: Control onboarding, exit-open messaging, and combat hit confirmation
- PR ID: PR-048
- REQ-ID: FR-003, FR-004
- ARCH-ID: Phaser-GameScene-Onboarding-And-Combat-Status
- IMPL-ID: Ralph-2026-03-15-pr-048-onboarding-exit-feedback
- TEST-ID list: TST-HUD-CONTROLS-STATUS, TST-BOOT-CONTROLS-PROMPT, TST-E2E-EXIT-OPEN-STATE, TST-E2E-COMBAT-FEEDBACK
- Branch: `ralph-wave-j-e2e`
- PR: n/a
- Date: 2026-03-15

## What Changed
- Added explicit controls onboarding on the start screen and mirrored that controls hint into runtime HUD/body dataset state.
- Added explicit exit-open signaling via HUD status text plus `document.body.dataset.vvExitState` so room-clear readiness is visible beyond the backdrop swap.
- Added lightweight combat feedback state plumbing so runtime status distinguishes `enemyHit`, `enemyDeath`, and `playerDamaged`, with HUD text reflecting the latest feedback.
- Kept the implementation narrow by extending the existing Phaser HUD/status path rather than adding new overlay systems.

## Files Added or Modified
- Added:
  - `docs/handoffs/2026-03-15-pr-048-control-onboarding-exit-messaging-hit-confirmation.md`
- Modified:
  - `.ralph/ralph-tasks.md`
  - `docs/architecture/phaser-migration.mmd`
  - `e2e/boot-smoke.spec.ts`
  - `e2e/combat-interactions.spec.ts`
  - `e2e/traversal-journey.spec.ts`
  - `src/phaser/scenes/GameScene.ts`
  - `src/phaser/scenes/gameplayStatus.spec.ts`
  - `src/phaser/scenes/gameplayStatus.ts`
- Deleted:
  - none

## Test Coverage Summary
- Unit tests added or updated:
  - `src/phaser/scenes/gameplayStatus.spec.ts`
- Runtime tests added or updated:
  - `e2e/boot-smoke.spec.ts`
  - `e2e/traversal-journey.spec.ts`
  - `e2e/combat-interactions.spec.ts`
- Full suite status:
  - build/lint/unit/e2e passing on latest verification

## Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/gameplayStatus.spec.ts`
- `npm run build && npx playwright test e2e/boot-smoke.spec.ts e2e/traversal-journey.spec.ts e2e/combat-interactions.spec.ts --grep "teaches WASD and Space controls on the start screen|surfaces an explicit exit-open runtime state when Level1 is cleared|surfaces hit confirmation separately from enemy death feedback"`
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
  - The first onboarding check looked for runtime prompt state without enabling the repo's `?e2e=1` runtime hook, so it read an empty prompt string.
- Fix applied 1:
  - Switched the onboarding browser proof to the e2e-enabled boot path and kept the start-screen text itself user-facing.
- Root cause hypothesis 2:
  - Combat feedback precedence allowed `enemyDeath` to be overwritten back to `enemyHit` when a shot killed one target while another target remained in the same resolution pass.
- Fix applied 2:
  - Preserved `enemyDeath` as the stronger feedback state and only emit `enemyHit` when no kill happened in that resolution.
- Re-run evidence:
  - Focused unit and focused browser checks passed, then the full build/lint/unit/e2e gate suite passed after the feedback-precedence fix.

## Known Edge Cases and Limitations
- Exit-open signaling currently relies on HUD text and runtime dataset state rather than a new bespoke art treatment; this is intentional to keep the PR narrow.
- Combat hit confirmation is stateful and lightweight, but later encounter-rule PRs may choose to tune the exact message wording/timing.

## Requirement Traceability
- `FR-003 Combat Feedback Upgrade` -> `src/phaser/scenes/GameScene.ts`, `src/phaser/scenes/gameplayStatus.ts`
- `FR-004 Exit Readiness Clarity` -> `src/phaser/scenes/GameScene.ts`, `src/phaser/scenes/gameplayStatus.ts`
- `SC-007 Start-of-game controls communicate WASD and Space clearly` -> `e2e/boot-smoke.spec.ts`
- `SC-008 Exit-open state is explicitly communicated in runtime and verifiable by browser tests` -> `e2e/traversal-journey.spec.ts`
- `SC-009 Enemy hit, enemy death, and player-damaged states are visually distinguishable` -> `e2e/combat-interactions.spec.ts`, `src/phaser/scenes/GameScene.ts`

## Next Recommended PR
- Next PR ID: PR-049
- Rationale:
  - With combat readability cues in place, the next narrow step is adding Level2's distinct infection-pressure room rule.
- Dependencies:
  - none
