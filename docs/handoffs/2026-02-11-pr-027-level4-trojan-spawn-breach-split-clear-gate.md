# Feature Handoff

- Feature name: Level4 Trojan spawn + breach damage + split-spawn-on-hit + clear gate (>=1000)
- PR ID: PR-027
- REQ-ID: REQ-PHASER-LEVEL4-TROJAN-COMBAT
- ARCH-ID: ARCH-PHASER-LEVEL4-TROJAN-COMBAT
- IMPL-ID: IMPL-PR-027-LEVEL4-TROJAN-COMBAT
- TEST-ID list: TEST-LEVEL4-TROJAN-SPAWN-CADENCE, TEST-LEVEL4-TROJAN-SPAWN-STOP-AT-THRESHOLD, TEST-LEVEL4-TROJAN-MOTION, TEST-LEVEL4-TROJAN-BREACH-DAMAGE-SPLIT, TEST-LEVEL4-TROJAN-PROJECTILE-SPLIT-SCORE, TEST-GATE-BUILD, TEST-GATE-LINT, TEST-GATE-UNIT, TEST-GATE-E2E
- Branch: current working branch
- PR: N/A (local iteration handoff)
- Date: 2026-02-11

## What Changed
- Added Level4 Trojan combat parity module with deterministic 2000ms spawn cadence, leftward motion, breach damage resolution, and split-spawn collision resolution.
- Added Trojan prefab and preload texture wiring for Phaser runtime.
- Integrated Level4 combat loop in `GameScene` for Trojan spawning/movement, projectile-hit split behavior, breach-triggered split behavior, and clear-gate active enemy count aggregation (Trojans + split minions).

## Files Added or Modified
- Added:
  - `src/phaser/scenes/level4TrojanCombat.ts`
  - `src/phaser/scenes/level4TrojanCombat.spec.ts`
  - `src/phaser/entities/TrojanPrefab.ts`
  - `docs/handoffs/2026-02-11-pr-027-level4-trojan-spawn-breach-split-clear-gate.md`
  - `build/phaser/scenes/level4TrojanCombat.js`
  - `build/phaser/scenes/level4TrojanCombat.js.map`
  - `build/phaser/entities/TrojanPrefab.js`
  - `build/phaser/entities/TrojanPrefab.js.map`
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
- Unit tests added or updated: `src/phaser/scenes/level4TrojanCombat.spec.ts`
- Parity tests added or updated: N/A (parity assertions live in unit suite)
- Runtime tests added or updated: None
- Full suite status: PASS

## Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/level4TrojanCombat.spec.ts` (RED)
- `npm run test:unit -- src/phaser/scenes/level4TrojanCombat.spec.ts` (GREEN)
- `npm run test:unit`
- `npm run build`
- `npm run lint` (FAIL: unused imports in `GameScene.ts`)
- `npm run lint` (GREEN after fix)
- `npm run build && npm run lint && npm run test:unit && npm run test:e2e`

## Quality Gate Results
- Static gate: PASS (`npm run build`, `npm run lint`)
- Behavioral gate: PASS (`npm run test:unit`)
- Runtime gate: PASS (`npm run test:e2e`)
- Documentation gate: PASS (handoff generated; architecture and known limitations updated)

## Failure Loop Notes
- Root cause hypothesis: Phaser runtime had Level4 traversal shell and transition checks but no Trojan lifecycle, so no Level4 enemy pressure existed and clear-gate behavior could not match legacy.
- First gate failure root cause: `GameScene.ts` included two unused imports after integrating Trojan flow.
- Fix applied: removed unused imports and re-ran all required gates after green lint.
- Re-run evidence: new Level4 Trojan spec failed before implementation due missing module import and passed after implementation; all required gates passed afterward.

## Known Edge Cases and Limitations
- Trojan sprite parity currently uses a single static frame and does not yet include legacy frame-cycling animation.
- Enemy collision matrix hardening (cross-enemy interactions in mixed Level1-4 scenarios) remains pending in PR-028.
- Boss systems remain pending (PR-029 onward).

## Parity Confirmation
- Scope confirmed: Level4 Trojan 2000ms spawn cadence, breach damage, split-spawn on projectile hit/breach, and Level4 clear-gate blocking on active enemy count before Level5 transition.
- Evidence: `src/phaser/scenes/level4TrojanCombat.ts`, `src/phaser/scenes/level4TrojanCombat.spec.ts`, `src/phaser/entities/TrojanPrefab.ts`, `src/phaser/scenes/GameScene.ts`, plus green gate outputs.
- Remaining parity gaps: enemy collision matrix hardening and boss systems.

## Next Recommended PR
- Next PR ID: PR-028
- Rationale: harden enemy collision matrix across Levels1-4 to stabilize mixed-enemy interactions now that Trojan split spawning is in place.
- Dependencies: PR-027 complete.
