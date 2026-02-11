# Ralph Tasks

## Wave A - Core Runtime and Governance
- [x] PR-001: Phaser dual-runtime bootstrap (legacy untouched)
- [x] PR-002: Scene lifecycle shell (Boot, Preload, Game skeleton)
- [x] PR-003: Shared constants parity table (movement, bounds, timers)
- [x] PR-004: ESLint config + npm run lint + warning baseline policy
- [x] PR-005: Vitest setup + first core logic tests
- [x] PR-006: Playwright setup + boot smoke + console-error guard
- [x] PR-007: Docs scaffolding (handoffs, architecture, known limitations, parity matrix)

## Wave B - Walkable Levels First (No Shooting and No Enemies)
- [x] PR-008: Level0 scene visuals + dialogue progression parity
- [x] PR-009: Player prefab + facing-direction states parity
- [x] PR-010: 8-direction movement + diagonal normalization parity
- [x] PR-011: Level0 bounds + transition trigger to Level1 parity
- [x] PR-012: Level1 shell (background, dialogue, bounds, transition zone)
- [x] PR-013: Level2 shell (same pattern)
- [x] PR-014: Level3 shell (same pattern)
- [x] PR-015: Level4 shell (same pattern)
- [x] PR-016: Level5 shell + non-combat victory shell wiring
- [x] PR-017: Transition rule engine wiring (score and item predicates wired only)

## Wave C - Shooting Systems
- [x] PR-018: Projectile base entity + movement + world culling
- [x] PR-019: Shoot input gating (disabled in Level0, enabled in combat levels)
- [x] PR-020: Single-shot pattern parity (Level1 and Level2)
- [x] PR-021: Dual-shot pattern parity (Level3)
- [x] PR-022: Triple-shot pattern parity (Level4 and Level5)
- [x] PR-023: Bullet hit resolution + death effect + score hook

## Wave D - Enemies by Level (One-by-One)
- [x] PR-024: Level1 FEmail spawn cadence + collision/damage/score + clear gate (>=200)
- [x] PR-025: Level2 RVirus spawn + stick-to-player + periodic HP drain + clear gate (>=400)
- [x] PR-026: Level3 Worm spawn + duplication timer + clear gate (>=600)
- [x] PR-027: Level4 Trojan spawn + breach damage + split-spawn-on-hit + clear gate (>=1000)
- [x] PR-028: Enemy collision matrix hardening for Levels1 to 4

## Wave E - Boss Fight Last
- [x] PR-029: Level5 MrHacker spawn + HP model + health bar parity
- [x] PR-030: Boss bullet firing + enemy bullet collision/damage parity
- [x] PR-031: Boss minion spawn cycle parity (FEmail, RVirus, Worm)
- [ ] PR-032: Boss defeat + win flow + final multiplier + restart parity

## Wave F - Cutover and Decommission
- [ ] PR-033: Full parity matrix run + stabilization fixes only
- [ ] PR-034: Switch default runtime to Phaser and retain legacy fallback flag
- [ ] PR-035: Remove legacy runtime after one stable cycle without P0/P1 regressions
