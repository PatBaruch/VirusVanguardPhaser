# Feature Handoff

- Feature name: Shoot input gating (disabled in Level0, enabled in combat levels)
- PR ID: PR-019
- REQ-ID: REQ-PHASER-SHOOTING-INPUT-GATE
- ARCH-ID: ARCH-PHASER-SHOOT-INPUT-GATE
- IMPL-ID: IMPL-PR-019-SHOOT-INPUT-GATE
- TEST-ID list: TEST-SHOOT-GATE-LEVEL0-BLOCK, TEST-SHOOT-GATE-COMBAT-ENABLE, TEST-GATE-BUILD, TEST-GATE-LINT, TEST-GATE-UNIT, TEST-GATE-E2E
- Branch: current working branch
- PR: N/A (local iteration handoff)
- Date: 2026-02-11

## What Changed
- Added a dedicated shoot input gate helper that mirrors legacy parity behavior: Space-triggered shooting input is blocked in Level0 and allowed in Levels1 through 5.
- Added unit coverage for the gate decision table to lock parity behavior for Level0 versus combat levels.
- Wired `GameScene` to emit a shoot-input event only when Space is newly pressed, the active level is combat-enabled by gate, and the active level phase is walkable.

## Files Added or Modified
- Added:
  - `src/phaser/scenes/shootInputGate.ts`
  - `src/phaser/scenes/shootInputGate.spec.ts`
  - `docs/handoffs/2026-02-11-pr-019-shoot-input-gating.md`
  - `build/phaser/scenes/shootInputGate.js`
  - `build/phaser/scenes/shootInputGate.js.map`
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
- Unit tests added or updated: `src/phaser/scenes/shootInputGate.spec.ts`
- Parity tests added or updated: N/A (parity assertions are covered in the unit suite)
- Runtime tests added or updated: None
- Full suite status: PASS

## Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/shootInputGate.spec.ts` (RED)
- `npm run test:unit -- src/phaser/scenes/shootInputGate.spec.ts` (GREEN)
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
- Root cause hypothesis: Phaser runtime had projectile primitives but no explicit level-based shoot input gate, so future shooting behavior could trigger outside parity constraints.
- Fix applied: implemented a minimal level-gate helper and emitted a shoot-input event only when gate and walkable-phase predicates are satisfied.
- Re-run evidence: new gate unit test passed after implementation, followed by full required gate pass.

## Known Edge Cases and Limitations
- This PR gates shoot input and emits a shoot intent event but does not yet spawn projectiles; shot patterns remain pending in PR-020 through PR-022.
- Projectile hit resolution, score hooks, and enemy damage interactions are still pending (PR-023 onward).

## Parity Confirmation
- Scope confirmed: Level0 shoot suppression and combat-level shoot enablement only.
- Evidence: `src/phaser/scenes/shootInputGate.ts`, `src/phaser/scenes/shootInputGate.spec.ts`, `src/phaser/scenes/GameScene.ts`, plus green gate outputs.
- Remaining parity gaps: projectile spawn patterns, projectile hit resolution, enemy systems by level, and boss combat systems.

## Next Recommended PR
- Next PR ID: PR-020
- Rationale: implement single-shot projectile spawn pattern parity for Level1 and Level2 using the new shoot-input gate event.
- Dependencies: PR-019 complete.
