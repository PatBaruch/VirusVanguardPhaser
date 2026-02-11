# Feature Handoff
- Feature name: Remove legacy runtime after one stable cycle without P0/P1 regressions
- PR ID: PR-035
- REQ-ID: PRD-9-PR-035
- ARCH-ID: ARCH-PHASER-RUNTIME-DECOMMISSION
- IMPL-ID: IMPL-PR-035-LEGACY-RUNTIME-REMOVAL
- TEST-ID list: TEST-PR-035-RUNTIME-MODE-UNIT, TEST-PR-035-BOOT-SMOKE-LEGACY-QUERY, TEST-PR-035-STATIC-BUILD, TEST-PR-035-STATIC-LINT, TEST-PR-035-UNIT-FULL-SUITE, TEST-PR-035-RUNTIME-E2E
- Branch: current working branch
- PR: pending

# What Changed
- Removed the legacy canvas runtime source tree and compiled artifacts from the repository.
- Updated runtime mode behavior so `?runtime=legacy` is ignored and Phaser remains the only runtime.
- Simplified app bootstrap to Phaser-only startup and extended e2e boot smoke coverage for `/?runtime=legacy`.
- Updated migration docs to reflect completed legacy decommission state.

# Files Added/Modified
- Added:
  - `docs/handoffs/2026-02-11-pr-035-remove-legacy-runtime-after-stable-cycle.md`
- Modified:
  - `.ralph/ralph-tasks.md`
  - `src/app.ts`
  - `src/runtime/RuntimeMode.ts`
  - `src/runtime/RuntimeMode.spec.ts`
  - `e2e/boot-smoke.spec.ts`
  - `docs/parity/known-limitations.md`
  - `docs/parity/parity-matrix.md`
  - `docs/architecture/phaser-migration.mmd`
  - `build/app.js`
  - `build/app.js.map`
  - `build/runtime/RuntimeMode.js`
  - `build/runtime/RuntimeMode.js.map`
- Deleted:
  - `src/VirusVanguard.ts`
  - `src/Game.ts`
  - `src/Level.ts`
  - `src/Level0.ts`
  - `src/Level1.ts`
  - `src/Level2.ts`
  - `src/Level3.ts`
  - `src/Level4.ts`
  - `src/Level5.ts`
  - `src/CanvasRenderer.ts`
  - `src/CanvasItem.ts`
  - `src/KeyListener.ts`
  - `src/Player.ts`
  - `src/GameItem.ts`
  - `src/GameItem/Bullet.ts`
  - `src/GameItem/Death.ts`
  - `src/GameItem/EnemyBullet.ts`
  - `src/GameItem/FEmail.ts`
  - `src/GameItem/MrHacker.ts`
  - `src/GameItem/RVirus.ts`
  - `src/GameItem/Trojan.ts`
  - `src/GameItem/Worm.ts`
  - `build/VirusVanguard.js`
  - `build/VirusVanguard.js.map`
  - `build/Game.js`
  - `build/Game.js.map`
  - `build/Level.js`
  - `build/Level.js.map`
  - `build/Level0.js`
  - `build/Level0.js.map`
  - `build/Level1.js`
  - `build/Level1.js.map`
  - `build/Level2.js`
  - `build/Level2.js.map`
  - `build/Level3.js`
  - `build/Level3.js.map`
  - `build/Level4.js`
  - `build/Level4.js.map`
  - `build/Level5.js`
  - `build/Level5.js.map`
  - `build/CanvasRenderer.js`
  - `build/CanvasRenderer.js.map`
  - `build/CanvasItem.js`
  - `build/CanvasItem.js.map`
  - `build/KeyListener.js`
  - `build/KeyListener.js.map`
  - `build/Player.js`
  - `build/Player.js.map`
  - `build/GameItem.js`
  - `build/GameItem.js.map`
  - `build/GameItem/Bullet.js`
  - `build/GameItem/Bullet.js.map`
  - `build/GameItem/Death.js`
  - `build/GameItem/Death.js.map`
  - `build/GameItem/EnemyBullet.js`
  - `build/GameItem/EnemyBullet.js.map`
  - `build/GameItem/FEmail.js`
  - `build/GameItem/FEmail.js.map`
  - `build/GameItem/MrHacker.js`
  - `build/GameItem/MrHacker.js.map`
  - `build/GameItem/RVirus.js`
  - `build/GameItem/RVirus.js.map`
  - `build/GameItem/Trojan.js`
  - `build/GameItem/Trojan.js.map`
  - `build/GameItem/Worm.js`
  - `build/GameItem/Worm.js.map`

# Test Coverage Summary
- Unit tests added/updated:
  - Updated `src/runtime/RuntimeMode.spec.ts` to enforce Phaser-only runtime selection even when `runtime=legacy` is provided.
- Parity tests added/updated:
  - None.
- Runtime tests added/updated:
  - Updated `e2e/boot-smoke.spec.ts` with a second smoke test covering `/?runtime=legacy` and asserting clean Phaser boot.
- Full suite status:
  - Passing.

# Quality Gate Results
- Static Gate: PASS
  - `npm run build`
  - `npm run lint`
- Behavioral Gate: PASS
  - `npm run test:unit -- src/runtime/RuntimeMode.spec.ts`
  - `npm run test:unit`
- Runtime Gate: PASS
  - `npm run test:e2e`
- Documentation Gate: PASS
  - Handoff created and architecture/limitations/parity docs updated for legacy decommission completion.

# Exact Verification Commands Run
- `npm run test:unit -- src/runtime/RuntimeMode.spec.ts` (red)
- `npm run test:unit -- src/runtime/RuntimeMode.spec.ts` (green)
- `npm run build`
- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`

# Known Edge Cases and Limitations
- Edge cases:
  - Unknown or legacy runtime query values no longer change runtime selection; Phaser boot is always used.
- Limitations:
  - No active legacy-vs-Phaser parity gaps remain in the migration plan scope.
- Risk notes:
  - Legacy rollback is no longer URL-selectable and would require restoring deleted runtime sources.

# Parity Confirmation
- Parity scope confirmed:
  - Wave F decommission completed by removing legacy runtime code and fallback wiring while keeping Phaser behavior stable.
- Evidence links:
  - `src/app.ts`
  - `src/runtime/RuntimeMode.ts`
  - `src/runtime/RuntimeMode.spec.ts`
  - `e2e/boot-smoke.spec.ts`
  - `docs/parity/known-limitations.md`
  - `docs/parity/parity-matrix.md`
  - `docs/architecture/phaser-migration.mmd`
- Remaining parity gaps:
  - None.

# Next Recommended PR
- Next PR ID: none (task train complete)
- Rationale:
  - PR-035 is the final locked task in `.ralph/ralph-tasks.md`; all migration waves are now complete.
- Dependencies:
  - None.
