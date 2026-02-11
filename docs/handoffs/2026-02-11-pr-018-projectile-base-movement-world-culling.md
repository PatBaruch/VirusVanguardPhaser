# Feature Handoff

- Feature name: Projectile base entity + movement + world culling
- PR ID: PR-018
- REQ-ID: REQ-PHASER-SHOOTING-PROJECTILE-BASE
- ARCH-ID: ARCH-PHASER-PROJECTILE-BASE-ENTITY
- IMPL-ID: IMPL-PR-018-PROJECTILE-BASE
- TEST-ID list: TEST-PROJECTILE-MOTION-PARITY, TEST-PROJECTILE-WORLD-CULLING-PARITY, TEST-GATE-BUILD, TEST-GATE-LINT, TEST-GATE-UNIT, TEST-GATE-E2E
- Branch: current working branch
- PR: N/A (local iteration handoff)
- Date: 2026-02-11

## What Changed
- Added a Phaser projectile base prefab that stores projectile velocity and updates projectile position from elapsed milliseconds.
- Added a parity-tested projectile motion helper and projectile world-culling helper using legacy combat bounds and legacy culling margins (`min * 0.9`, `max * 1.05`).
- Loaded the Phaser projectile texture key in `PreloadScene` so shooting follow-up PRs can spawn projectiles without extra preload wiring.

## Files Added or Modified
- Added:
  - `src/phaser/entities/projectileMotion.ts`
  - `src/phaser/entities/projectileMotion.spec.ts`
  - `src/phaser/entities/ProjectilePrefab.ts`
  - `docs/handoffs/2026-02-11-pr-018-projectile-base-movement-world-culling.md`
- Modified:
  - `src/phaser/scenes/PreloadScene.ts`
  - `docs/parity/known-limitations.md`
  - `docs/architecture/phaser-migration.mmd`
  - `.ralph/ralph-tasks.md`
  - `build/phaser/scenes/PreloadScene.js`
  - `build/phaser/scenes/PreloadScene.js.map`
  - `build/phaser/entities/projectileMotion.js`
  - `build/phaser/entities/projectileMotion.js.map`
  - `build/phaser/entities/ProjectilePrefab.js`
  - `build/phaser/entities/ProjectilePrefab.js.map`
- Deleted:
  - None

## Test Coverage Summary
- Unit tests added or updated: `src/phaser/entities/projectileMotion.spec.ts`
- Parity tests added or updated: N/A (parity assertions are covered in the unit suite)
- Runtime tests added or updated: None
- Full suite status: PASS

## Verification Commands Run
- `npm run test:unit -- src/phaser/entities/projectileMotion.spec.ts` (RED)
- `npm run test:unit -- src/phaser/entities/projectileMotion.spec.ts` (GREEN)
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
- Root cause hypothesis: projectile movement and culling behavior had no Phaser module, so the initial projectile unit suite failed due to missing module import.
- Fix applied: implemented minimal projectile motion/culling helpers, introduced a base projectile prefab wrapper, and wired projectile texture preload.
- Re-run evidence: projectile unit suite passed after implementation, followed by full required gate pass.

## Known Edge Cases and Limitations
- Projectile base motion and culling are implemented, but projectiles are not yet spawned because shoot input gating and shot pattern generation are still pending (PR-019 to PR-022).
- Projectile hit resolution, score hooks, and enemy damage interactions are still pending (PR-023 onward).

## Parity Confirmation
- Scope confirmed: projectile base entity movement and world culling only.
- Evidence: `src/phaser/entities/projectileMotion.ts`, `src/phaser/entities/ProjectilePrefab.ts`, `src/phaser/entities/projectileMotion.spec.ts`, plus green gate outputs.
- Remaining parity gaps: shoot gating/patterns, projectile hit resolution, enemies by level, and boss combat systems.

## Next Recommended PR
- Next PR ID: PR-019
- Rationale: wire shoot input gating by level so the new projectile base can be spawned only in combat levels.
- Dependencies: PR-018 complete.
