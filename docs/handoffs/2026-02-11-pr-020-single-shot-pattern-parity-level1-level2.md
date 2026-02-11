# Feature Handoff

- Feature name: Single-shot pattern parity (Level1 and Level2)
- PR ID: PR-020
- REQ-ID: REQ-PHASER-SHOOTING-SINGLE-SHOT
- ARCH-ID: ARCH-PHASER-SINGLE-SHOT-PATTERN
- IMPL-ID: IMPL-PR-020-SINGLE-SHOT-PATTERN
- TEST-ID list: TEST-SINGLE-SHOT-L1-L2-DIRECTIONAL-VELOCITY, TEST-SINGLE-SHOT-LEVEL-GATE, TEST-GATE-BUILD, TEST-GATE-LINT, TEST-GATE-UNIT, TEST-GATE-E2E
- Branch: current working branch
- PR: N/A (local iteration handoff)
- Date: 2026-02-11

## What Changed
- Added a pure single-shot pattern resolver that mirrors legacy Level1 and Level2 shooting behavior: exactly one projectile spawns per Space press using direction-based velocity mapping, including diagonal normalization.
- Wired `GameScene` to consume the existing shoot-input event and spawn `ProjectilePrefab` instances using player-center start coordinates and Level1/Level2 parity rules.
- Added in-scene projectile lifecycle updates so spawned projectiles advance each frame and are culled using the existing combat world-bounds parity thresholds.

## Files Added or Modified
- Added:
  - `src/phaser/scenes/singleShotPattern.ts`
  - `src/phaser/scenes/singleShotPattern.spec.ts`
  - `docs/handoffs/2026-02-11-pr-020-single-shot-pattern-parity-level1-level2.md`
  - `build/phaser/scenes/singleShotPattern.js`
  - `build/phaser/scenes/singleShotPattern.js.map`
- Modified:
  - `src/phaser/scenes/GameScene.ts`
  - `build/phaser/scenes/GameScene.js`
  - `build/phaser/scenes/GameScene.js.map`
  - `docs/parity/known-limitations.md`
  - `docs/architecture/phaser-migration.mmd`
  - `.ralph/ralph-tasks.md`
- Deleted:
  - None

## Test Coverage Summary
- Unit tests added or updated: `src/phaser/scenes/singleShotPattern.spec.ts`
- Parity tests added or updated: N/A (parity assertions are covered in the unit suite)
- Runtime tests added or updated: None
- Full suite status: PASS

## Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/singleShotPattern.spec.ts` (RED)
- `npm run test:unit -- src/phaser/scenes/singleShotPattern.spec.ts` (GREEN)
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
- Root cause hypothesis: Phaser runtime already accepted combat shoot input but had no level-specific single-shot spawn resolver and no event consumer to materialize the projectile.
- Fix applied: added a focused single-shot resolver for Level1/2 parity and wired `GameScene` shoot-input handling to spawn and update/cull projectiles.
- Re-run evidence: single-shot parity test failed before implementation, then passed; all required gates passed afterward.

## Known Edge Cases and Limitations
- This PR only implements single-shot behavior for Level1 and Level2.
- Dual-shot (Level3), triple-shot (Level4/5), and projectile hit resolution/score hooks remain pending in PR-021 through PR-023.

## Parity Confirmation
- Scope confirmed: single-shot projectile behavior parity for Level1 and Level2 only.
- Evidence: `src/phaser/scenes/singleShotPattern.ts`, `src/phaser/scenes/singleShotPattern.spec.ts`, `src/phaser/scenes/GameScene.ts`, plus green gate outputs.
- Remaining parity gaps: dual/triple shot patterns, projectile hit resolution, enemy systems by level, and boss combat systems.

## Next Recommended PR
- Next PR ID: PR-021
- Rationale: implement dual-shot pattern parity for Level3 on top of the shared projectile spawn path.
- Dependencies: PR-020 complete.
