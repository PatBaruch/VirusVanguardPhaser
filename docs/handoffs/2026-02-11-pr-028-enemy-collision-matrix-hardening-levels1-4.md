# Feature Handoff

- Feature name: Enemy collision matrix hardening for Levels1 to 4
- PR ID: PR-028
- REQ-ID: REQ-PHASER-ENEMY-COLLISION-MATRIX-L1-L4
- ARCH-ID: ARCH-PHASER-ENEMY-COLLISION-MATRIX-L1-L4
- IMPL-ID: IMPL-PR-028-ENEMY-COLLISION-MATRIX-L1-L4
- TEST-ID list: TEST-LEVEL3-WORM-PLAYER-COLLISION, TEST-LEVEL4-TROJAN-PLAYER-COLLISION, TEST-GATE-BUILD, TEST-GATE-LINT, TEST-GATE-UNIT, TEST-GATE-E2E
- Branch: current working branch
- PR: N/A (local iteration handoff)
- Date: 2026-02-11

## What Changed
- Added a shared enemy collision matrix resolver that centralizes player-contact collision outcomes by enemy class for Levels1 to 4.
- Wired Level3 Worm and Level4 Trojan combat modules to expose player-contact collision resolvers using the shared matrix.
- Integrated GameScene Level3 and Level4 updates so worm and trojan player overlaps now apply parity damage/removal behavior during active combat loops.

## Files Added or Modified
- Added:
  - `src/phaser/scenes/enemyCollisionMatrix.ts`
  - `docs/handoffs/2026-02-11-pr-028-enemy-collision-matrix-hardening-levels1-4.md`
  - `build/phaser/scenes/enemyCollisionMatrix.js`
  - `build/phaser/scenes/enemyCollisionMatrix.js.map`
- Modified:
  - `src/phaser/scenes/GameScene.ts`
  - `src/phaser/scenes/level1FEmailCombat.ts`
  - `src/phaser/scenes/level3WormCombat.ts`
  - `src/phaser/scenes/level4TrojanCombat.ts`
  - `src/phaser/scenes/level3WormCombat.spec.ts`
  - `src/phaser/scenes/level4TrojanCombat.spec.ts`
  - `docs/parity/known-limitations.md`
  - `docs/architecture/phaser-migration.mmd`
  - `.ralph/ralph-tasks.md`
  - `build/phaser/scenes/GameScene.js`
  - `build/phaser/scenes/GameScene.js.map`
  - `build/phaser/scenes/level1FEmailCombat.js`
  - `build/phaser/scenes/level1FEmailCombat.js.map`
  - `build/phaser/scenes/level3WormCombat.js`
  - `build/phaser/scenes/level3WormCombat.js.map`
  - `build/phaser/scenes/level4TrojanCombat.js`
  - `build/phaser/scenes/level4TrojanCombat.js.map`
- Deleted:
  - None

## Test Coverage Summary
- Unit tests added or updated: `src/phaser/scenes/level3WormCombat.spec.ts`, `src/phaser/scenes/level4TrojanCombat.spec.ts`
- Parity tests added or updated: N/A (parity assertions are covered in unit suites)
- Runtime tests added or updated: None
- Full suite status: PASS

## Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/level3WormCombat.spec.ts src/phaser/scenes/level4TrojanCombat.spec.ts` (RED)
- `npm run test:unit -- src/phaser/scenes/level3WormCombat.spec.ts src/phaser/scenes/level4TrojanCombat.spec.ts` (GREEN)
- `npm run build && npm run lint && npm run test:unit && npm run test:e2e`

## Quality Gate Results
- Static gate: PASS (`npm run build`, `npm run lint`)
- Behavioral gate: PASS (`npm run test:unit`)
- Runtime gate: PASS (`npm run test:e2e`)
- Documentation gate: PASS (handoff generated; architecture and known limitations updated)

## Failure Loop Notes
- Root cause hypothesis: enemy player-contact collision outcomes were inconsistent across Levels1 to 4 because only FEmail collisions were modeled as direct contact damage/removal while Worm and Trojan contacts were not yet wired.
- RED evidence: new worm/trojan player-collision unit tests failed with missing function exports.
- Fix applied: introduced shared collision matrix resolver and wired new Level3/Level4 player-collision resolvers into combat update flow.
- Re-run evidence: targeted RED tests turned GREEN and full required gate suite passed.

## Known Edge Cases and Limitations
- RVirus player-contact behavior remains special-cased to attachment + periodic drain and is intentionally excluded from direct-contact destroy-on-hit matrix outcomes.
- Trojan split-spawn parity remains tied to projectile hit and left-boundary breach events only.
- Boss systems remain pending (PR-029 onward).

## Parity Confirmation
- Parity scope confirmed: Levels1 to 4 now use explicit player-contact enemy collision outcomes that align with existing legacy behavior classes (direct-contact destroy/damage for FEmail, Worm, Trojan; RVirus attachment path preserved).
- Evidence: `src/phaser/scenes/enemyCollisionMatrix.ts`, `src/phaser/scenes/level3WormCombat.ts`, `src/phaser/scenes/level4TrojanCombat.ts`, `src/phaser/scenes/GameScene.ts`, and green gate outputs.
- Remaining parity gaps: boss systems and cutover/decommission work.

## Next Recommended PR
- Next PR ID: PR-029
- Rationale: begin Level5 boss parity by introducing MrHacker spawn, HP model, and health bar behavior.
- Dependencies: PR-028 complete.
