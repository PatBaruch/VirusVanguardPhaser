# Feature Handoff
- Feature name: Boss minion spawn cycle parity (FEmail, RVirus, Worm)
- PR ID: PR-031
- REQ-ID: PRD-9-PR-031
- ARCH-ID: ARCH-PHASER-MIGRATION-D28
- IMPL-ID: IMPL-PR-031-LEVEL5-BOSS-MINION-CYCLE
- TEST-ID list: TEST-PR-031-UNIT-LEVEL5-MINION-CYCLE, TEST-PR-031-STATIC-BUILD, TEST-PR-031-STATIC-LINT, TEST-PR-031-RUNTIME-E2E
- Branch: current working branch
- PR: pending

# What Changed
- Added a Level5 boss-minion cycle state machine with legacy 3000ms cadence and random bucket selection (`<0.33` FEmail, `<0.66` RVirus, otherwise Worm).
- Added parity spawn snapshots for boss minions using legacy offsets relative to MrHacker (`x + 100`, `y + 30` for FEmail/Worm, `y - 30` for RVirus) and legacy per-type spawn stats.
- Wired GameScene Level5 combat integration so minion spawn cycle runs while boss is alive, and spawned minions continue using existing Level1/Level2/Level3 combat handlers (including after boss defeat) with active-combat counting updated for transition gating parity.

# Files Added/Modified
- Added:
  - `docs/handoffs/2026-02-11-pr-031-boss-minion-spawn-cycle-parity.md`
- Modified:
  - `src/phaser/scenes/level5MrHackerCombat.ts`
  - `src/phaser/scenes/level5MrHackerCombat.spec.ts`
  - `src/phaser/scenes/GameScene.ts`
  - `docs/parity/known-limitations.md`
  - `docs/architecture/phaser-migration.mmd`
  - `.ralph/ralph-tasks.md`
- Deleted:
  - None

# Test Coverage Summary
- Unit tests added/updated:
  - `src/phaser/scenes/level5MrHackerCombat.spec.ts` now covers Level5 boss-minion spawn cadence, RNG bucket selection, spawn offsets, and single-spawn-per-update timer reset behavior.
- Parity tests added/updated:
  - Level5 parity spec extended for boss minion cycle timing/selection behavior.
- Runtime tests added/updated:
  - No new Playwright file added; existing runtime smoke gate executed.
- Full suite status:
  - Passing.

# Quality Gate Results
- Static Gate: PASS
  - `npm run build`
  - `npm run lint`
- Behavioral Gate: PASS
  - `npm run test:unit`
- Runtime Gate: PASS
  - `npm run test:e2e`
- Documentation Gate: PASS
  - Handoff created, architecture updated, known limitations updated.

# Exact Verification Commands Run
- `npm run test:unit -- src/phaser/scenes/level5MrHackerCombat.spec.ts` (red before implementation, green after implementation)
- `npm run build`
- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`

# Known Edge Cases and Limitations
- Edge cases:
  - Level5 boss minion cycle mirrors legacy single-spawn update semantics by spawning at most one minion per frame even when elapsed time greatly exceeds the 3000ms interval.
- Limitations:
  - Boss defeat + final win flow + multiplier/restart parity remains pending in PR-032.
- Risk notes:
  - Level5 minion combat reuses Level1 to Level3 enemy update systems; any future changes to those systems affect both their native levels and Level5 boss-minion behavior.

# Parity Confirmation
- Parity scope confirmed:
  - Boss-driven minion cycle cadence, random enemy-type bucket selection, and spawn positioning parity for Level5.
- Evidence links:
  - `src/phaser/scenes/level5MrHackerCombat.spec.ts`
  - `src/phaser/scenes/level5MrHackerCombat.ts`
  - `src/phaser/scenes/GameScene.ts`
- Remaining parity gaps:
  - `PR-032` boss defeat + win flow + final multiplier + restart parity

# Next Recommended PR
- Next PR ID: PR-032
- Rationale:
  - With boss spawn, HP model, bullets, and minion cycles in place, the final Wave E parity slice is boss defeat/win-flow finalization.
- Dependencies:
  - Builds on PR-029, PR-030, and PR-031 Level5 combat wiring.
