# Feature Handoff

- Feature name: Level2 infection-pressure encounter rule
- PR ID: PR-049
- REQ-ID: FR-005
- ARCH-ID: Phaser-Level2-Infection-Pressure
- IMPL-ID: Ralph-2026-03-15-pr-049-infection-pressure
- TEST-ID list: TST-LEVEL2-INFECTION-LANE, TST-LEVEL2-INFECTION-TICK, TST-E2E-LEVEL2-INFECTION-STATE, TST-E2E-LEVEL2-INFECTION-CLEAR-ON-GAMEOVER
- Branch: `ralph-wave-j-e2e`
- PR: n/a
- Date: 2026-03-15

## What Changed
- Added a deterministic Level2 infection-pressure rule that projects a visible vertical hazard lane from an active free RVirus.
- Added periodic chip damage when the player lingers inside the infection lane, creating real repositioning urgency instead of a cosmetic-only warning.
- Surfaced Level2 lane state through HUD/body dataset fields and a translucent green overlay so reviewers can identify the danger source directly on screen.
- Added unit coverage for lane generation/tick damage and browser coverage for the visible lane plus cleanup on terminal state.

## Files Added or Modified
- Added:
  - `docs/handoffs/2026-03-15-pr-049-level2-infection-pressure-encounter-rule.md`
- Modified:
  - `.ralph/ralph-tasks.md`
  - `docs/architecture/phaser-migration.mmd`
  - `docs/parity/known-limitations.md`
  - `e2e/combat-interactions.spec.ts`
  - `src/phaser/scenes/GameScene.ts`
  - `src/phaser/scenes/gameplayStatus.ts`
  - `src/phaser/scenes/level2RVirusCombat.spec.ts`
  - `src/phaser/scenes/level2RVirusCombat.ts`
- Deleted:
  - none

## Test Coverage Summary
- Unit tests added or updated:
  - `src/phaser/scenes/level2RVirusCombat.spec.ts`
  - `src/phaser/scenes/gameplayStatus.spec.ts`
- Runtime tests added or updated:
  - `e2e/combat-interactions.spec.ts`
- Full suite status:
  - build/lint/unit/e2e passing on latest verification

## Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/level2RVirusCombat.spec.ts`
- `npm run build && npx playwright test e2e/combat-interactions.spec.ts --grep "surfaces the Level2 infection lane state when the player stands inside RVirus pressure"`
- `npm run test:unit -- src/phaser/scenes/gameplayStatus.spec.ts src/phaser/scenes/level2RVirusCombat.spec.ts`
- `npm run build && npx playwright test e2e/combat-interactions.spec.ts --grep "surfaces the Level2 infection lane state when the player stands inside RVirus pressure"`
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
  - The initial Level2 browser proof returned zero hazards because the test only advanced one frame, and `syncGameplayHud()` runs before level-specific combat logic in the frame update.
- Fix applied 1:
  - Explicitly refreshed HUD state after the Level2 combat step in the focused browser test.
- Root cause hypothesis 2:
  - The infection lane overlay was not cleared by the game-over view, so the green strip could persist on a terminal screen.
- Fix applied 2:
  - Cleared the Level2 pressure overlay during game-over and victory visual-state sync, then added a browser regression check for that cleanup.
- Re-run evidence:
  - Focused unit and browser checks passed, then the full build/lint/unit/e2e gate suite passed after the overlay cleanup fix.

## Known Edge Cases and Limitations
- The infection lane currently tracks the first active free RVirus rather than coordinating multiple simultaneous lanes, which keeps the rule readable and avoids overcluttering Level2.
- Lane damage is intentionally mild first-pass tuning and may be revisited after later encounter-rule playability sweeps.

## Requirement Traceability
- `FR-005 Level2 Encounter Rule: Infection Pressure` -> `src/phaser/scenes/level2RVirusCombat.ts`, `src/phaser/scenes/GameScene.ts`
- `SC-010 Levels2-5 each contain one distinct room rule beyond base enemy stats` -> `src/phaser/scenes/level2RVirusCombat.ts`
- `SC-011 Each room rule changes player movement or target priority in a reviewer-observable way` -> `e2e/combat-interactions.spec.ts`
- `SC-012 A reviewer can summarize each combat level using its core tactical rule` -> HUD/body dataset infection-lane state in `src/phaser/scenes/GameScene.ts`

## Next Recommended PR
- Next PR ID: PR-050
- Rationale:
  - Level2 now has its own room identity, so the next narrow slice is Level3's duplication-control rule.
- Dependencies:
  - none
