# Feature Handoff

- Feature name: Level2 RVirus spawn + stick-to-player + periodic HP drain + clear gate (>=400)
- PR ID: PR-025
- REQ-ID: REQ-PHASER-LEVEL2-RVIRUS-COMBAT
- ARCH-ID: ARCH-PHASER-LEVEL2-RVIRUS-COMBAT
- IMPL-ID: IMPL-PR-025-LEVEL2-RVIRUS-COMBAT
- TEST-ID list: TEST-LEVEL2-RVIRUS-SPAWN-CADENCE, TEST-LEVEL2-RVIRUS-SPAWN-STOP-AT-THRESHOLD, TEST-LEVEL2-RVIRUS-STICK-TO-PLAYER, TEST-LEVEL2-RVIRUS-PERIODIC-HP-DRAIN, TEST-GATE-BUILD, TEST-GATE-LINT, TEST-GATE-UNIT, TEST-GATE-E2E
- Branch: current working branch
- PR: N/A (local iteration handoff)
- Date: 2026-02-11

## What Changed
- Added Level2 RVirus combat parity logic with deterministic 1000ms spawn cadence while score is below 400.
- Added Level2 RVirus attach/stick behavior: first overlap locks one RVirus to player position, boosts stuck-health model, and starts periodic HP drain timing.
- Added 1500ms periodic player HP drain while RVirus remains attached, plus GameScene integration for Level2 spawn/motion/attachment/projectile-hit flow and clear-gate active enemy count.

## Files Added or Modified
- Added:
  - `src/phaser/scenes/level2RVirusCombat.ts`
  - `src/phaser/scenes/level2RVirusCombat.spec.ts`
  - `src/phaser/entities/RVirusPrefab.ts`
  - `docs/handoffs/2026-02-11-pr-025-level2-rvirus-spawn-stick-periodic-hp-drain-clear-gate.md`
  - `build/phaser/scenes/level2RVirusCombat.js`
  - `build/phaser/scenes/level2RVirusCombat.js.map`
  - `build/phaser/entities/RVirusPrefab.js`
  - `build/phaser/entities/RVirusPrefab.js.map`
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
- Unit tests added or updated: `src/phaser/scenes/level2RVirusCombat.spec.ts`
- Parity tests added or updated: N/A (parity assertions live in unit suite)
- Runtime tests added or updated: None
- Full suite status: PASS

## Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/level2RVirusCombat.spec.ts` (RED)
- `npm run test:unit -- src/phaser/scenes/level2RVirusCombat.spec.ts` (GREEN)
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
- Root cause hypothesis: Phaser runtime had Level2 traversal shell and transition thresholds but no RVirus lifecycle, so Level2-specific enemy parity (spawn, stick behavior, and timed HP drain) was missing.
- Fix applied: added pure Level2 RVirus combat logic, RVirus prefab + preload wiring, and GameScene integration for spawn cadence, attachment behavior, periodic HP drain, projectile-hit score updates, and active-item clear-gate counts.
- Re-run evidence: new Level2 RVirus spec failed before implementation due missing module import and passed after implementation; all required gates passed afterward.

## Known Edge Cases and Limitations
- Level2 RVirus currently uses a single static sprite frame in Phaser and does not yet include legacy frame-cycling animation parity.
- Phaser runtime still lacks Level3 Worm, Level4 Trojan, enemy matrix hardening, and boss systems.

## Parity Confirmation
- Scope confirmed: Level2 RVirus spawn cadence, stick-to-player behavior, periodic HP drain while attached, and clear-gate blocking on active enemy count.
- Evidence: `src/phaser/scenes/level2RVirusCombat.ts`, `src/phaser/scenes/level2RVirusCombat.spec.ts`, `src/phaser/entities/RVirusPrefab.ts`, `src/phaser/scenes/GameScene.ts`, plus green gate outputs.
- Remaining parity gaps: Level3 Worm behavior, Level4 Trojan behavior, enemy collision matrix hardening, and boss systems.

## Next Recommended PR
- Next PR ID: PR-026
- Rationale: implement Level3 Worm spawn + duplication timer + clear gate (>=600) on top of the expanded multi-enemy combat wiring.
- Dependencies: PR-025 complete.
