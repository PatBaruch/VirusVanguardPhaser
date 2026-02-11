# Feature Handoff

- Feature name: Level5 MrHacker spawn + HP model + health bar parity
- PR ID: PR-029
- REQ-ID: REQ-PHASER-LEVEL5-MRHACKER-SPAWN-HP-HEALTHBAR
- ARCH-ID: ARCH-PHASER-LEVEL5-MRHACKER-SPAWN-HP-HEALTHBAR
- IMPL-ID: IMPL-PR-029-LEVEL5-MRHACKER-SPAWN-HP-HEALTHBAR
- TEST-ID list: TEST-LEVEL5-MRHACKER-SPAWN-ONCE, TEST-LEVEL5-MRHACKER-HEALTHBAR-MAPPING, TEST-GATE-BUILD, TEST-GATE-LINT, TEST-GATE-UNIT, TEST-GATE-E2E
- Branch: current working branch
- PR: N/A (local iteration handoff)
- Date: 2026-02-11

## What Changed
- Added a dedicated Level5 MrHacker combat parity module that introduces one-time boss spawn state, legacy HP/damage/score constants, and health-bar texture mapping for the 0..25 HP range.
- Added a MrHacker Phaser prefab and integrated it into `GameScene` so Level5 walkable phase now spawns the boss, keeps active-combat gating blocked while boss is alive, and updates health-bar texture frames from current HP.
- Added PreloadScene asset wiring for Hacker sprites and full boss-bar frame sheet so runtime texture keys are available before Level5 combat begins.

## Files Added or Modified
- Added:
  - `src/phaser/scenes/level5MrHackerCombat.ts`
  - `src/phaser/scenes/level5MrHackerCombat.spec.ts`
  - `src/phaser/entities/MrHackerPrefab.ts`
  - `docs/handoffs/2026-02-11-pr-029-level5-mrhacker-spawn-hp-health-bar-parity.md`
  - `build/phaser/scenes/level5MrHackerCombat.js`
  - `build/phaser/scenes/level5MrHackerCombat.js.map`
  - `build/phaser/entities/MrHackerPrefab.js`
  - `build/phaser/entities/MrHackerPrefab.js.map`
- Modified:
  - `src/phaser/scenes/GameScene.ts`
  - `src/phaser/scenes/PreloadScene.ts`
  - `docs/parity/known-limitations.md`
  - `docs/architecture/phaser-migration.mmd`
  - `.ralph/ralph-tasks.md`
  - `build/phaser/scenes/GameScene.js`
  - `build/phaser/scenes/GameScene.js.map`
  - `build/phaser/scenes/PreloadScene.js`
  - `build/phaser/scenes/PreloadScene.js.map`
- Deleted:
  - None

## Test Coverage Summary
- Unit tests added or updated: `src/phaser/scenes/level5MrHackerCombat.spec.ts`
- Parity tests added or updated: N/A (parity assertions are covered in unit suite)
- Runtime tests added or updated: None
- Full suite status: PASS

## Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/level5MrHackerCombat.spec.ts` (RED)
- `npm run test:unit -- src/phaser/scenes/level5MrHackerCombat.spec.ts` (GREEN)
- `npm run build && npm run lint && npm run test:unit && npm run test:e2e`

## Quality Gate Results
- Static gate: PASS (`npm run build`, `npm run lint`)
- Behavioral gate: PASS (`npm run test:unit`)
- Runtime gate: PASS (`npm run test:e2e`)
- Documentation gate: PASS (handoff generated; architecture and known limitations updated)

## Failure Loop Notes
- Root cause hypothesis: Level5 lacked a dedicated boss state machine, so active-combat gating remained tied to non-boss entities and no MrHacker HP/health-bar parity surface existed.
- RED evidence: new Level5 MrHacker test suite failed with missing `level5MrHackerCombat` module import.
- Fix applied: implemented Level5 boss parity module + prefab + scene/preload wiring for spawn, HP model, and health-bar texture resolution.
- Re-run evidence: targeted RED suite turned GREEN and full required gates passed.

## Known Edge Cases and Limitations
- MrHacker projectile-firing and enemy-bullet collision/damage behavior is intentionally deferred to PR-030.
- Boss minion spawn cycle parity is intentionally deferred to PR-031.
- Boss defeat final multiplier/restart flow parity is intentionally deferred to PR-032.

## Parity Confirmation
- Parity scope confirmed: Level5 now spawns one MrHacker boss instance with legacy HP model values and renders legacy-indexed boss-bar frames based on current boss HP.
- Evidence: `src/phaser/scenes/level5MrHackerCombat.ts`, `src/phaser/entities/MrHackerPrefab.ts`, `src/phaser/scenes/GameScene.ts`, `src/phaser/scenes/PreloadScene.ts`, and green gate outputs.
- Remaining parity gaps: boss bullets, boss minion cycles, and boss defeat/win-flow finalization.

## Next Recommended PR
- Next PR ID: PR-030
- Rationale: add MrHacker bullet firing parity and enemy-bullet collision/damage handling to complete the next boss combat behavior slice.
- Dependencies: PR-029 complete.
