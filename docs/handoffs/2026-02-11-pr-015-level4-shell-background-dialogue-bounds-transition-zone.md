# Feature Handoff

- Feature name: Level4 shell (background, dialogue, bounds, transition zone)
- PR ID: PR-015
- REQ-ID: REQ-PHASER-LEVEL4-SHELL
- ARCH-ID: ARCH-PHASER-LEVEL4-TRAVERSAL-SHELL
- IMPL-ID: IMPL-PR-015-LEVEL4-SHELL
- TEST-ID list: TEST-LEVEL4-DIALOGUE-STATE-PARITY, TEST-LEVEL4-TRAVERSAL-RULES-PARITY, TEST-GATE-BUILD, TEST-GATE-LINT, TEST-GATE-UNIT, TEST-GATE-E2E
- Branch: current working branch
- PR: N/A (local iteration handoff)
- Date: 2026-02-11

## What Changed
- Added Level4 dialogue state helpers for two-image progression (`Level4-0` and `Level4-1`) that enter walkable mode after the last image, matching legacy Level4 shell progression shape.
- Added Level4 traversal rule helpers for movement bounds and Level4-to-Level5 transition corridor thresholds based on parity constants.
- Updated Phaser preload lifecycle to load Level4 dialogue textures.
- Updated `GameScene` so the Level3 transition now enters the Level4 shell, applies Level4 background/dialogue visibility behavior, gates movement by Level4 bounds in walkable mode, and emits a Level4-to-Level5 transition event when the transition zone is reached.

## Files Added or Modified
- Added:
  - `src/phaser/scenes/level4DialogueState.ts`
  - `src/phaser/scenes/level4DialogueState.spec.ts`
  - `src/phaser/scenes/level4TraversalRules.ts`
  - `src/phaser/scenes/level4TraversalRules.spec.ts`
  - `docs/handoffs/2026-02-11-pr-015-level4-shell-background-dialogue-bounds-transition-zone.md`
- Modified:
  - `src/phaser/scenes/PreloadScene.ts`
  - `src/phaser/scenes/GameScene.ts`
  - `docs/parity/known-limitations.md`
  - `docs/architecture/phaser-migration.mmd`
  - `.ralph/ralph-tasks.md`
  - `build/phaser/scenes/PreloadScene.js`
  - `build/phaser/scenes/PreloadScene.js.map`
  - `build/phaser/scenes/GameScene.js`
  - `build/phaser/scenes/GameScene.js.map`
- Deleted:
  - None

## Test Coverage Summary
- Unit tests added or updated: `src/phaser/scenes/level4DialogueState.spec.ts`, `src/phaser/scenes/level4TraversalRules.spec.ts`
- Parity tests added or updated: N/A (parity assertions are covered in Level4 dialogue/traversal unit tests)
- Runtime tests added or updated: None
- Full suite status: PASS

## Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/level4DialogueState.spec.ts src/phaser/scenes/level4TraversalRules.spec.ts` (RED)
- `npm run test:unit -- src/phaser/scenes/level4DialogueState.spec.ts src/phaser/scenes/level4TraversalRules.spec.ts` (GREEN)
- `npm run build`
- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`

## Quality Gate Results
- Static gate: PASS (`npm run build`, `npm run lint`)
- Behavioral gate: PASS (`npm run test:unit`)
- Runtime gate: PASS (`npm run test:e2e`)
- Documentation gate: PASS (handoff generated; architecture and known limitations updated)

## Failure Loop Notes
- Root cause hypothesis: RED run failed because Level4 dialogue/traversal modules did not exist yet.
- Fix applied: Implemented Level4 dialogue state and traversal rule modules, then wired them into Phaser preload and `GameScene` Level3-to-Level4 flow.
- Re-run evidence: Targeted Level4 tests passed after implementation, followed by all required gates passing.

## Known Edge Cases and Limitations
- Level4-to-Level5 transition event currently fires from geometric corridor detection only; score and enemy-clear predicates remain intentionally deferred to PR-017 transition rule engine wiring.
- Dedicated Level5 Phaser shell and non-combat victory shell wiring remain out of scope for this PR and are planned in PR-016.

## Parity Confirmation
- Scope confirmed: Phaser Level4 shell parity for background class, dialogue progression, movement bounds, and transition zone detection only.
- Evidence: `src/phaser/scenes/level4DialogueState.ts`, `src/phaser/scenes/level4TraversalRules.ts`, `src/phaser/scenes/GameScene.ts`, plus green gate outputs.
- Remaining parity gaps: PR-016 onward (Level5 shell wiring, transition predicates, shooting, enemies, and boss systems).

## Next Recommended PR
- Next PR ID: PR-016
- Rationale: add Level5 shell plus non-combat victory shell wiring to complete walkable-level shell coverage before transition predicate wiring.
- Dependencies: PR-015 complete.
