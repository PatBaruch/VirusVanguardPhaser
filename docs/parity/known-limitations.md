# Known Parity Limitations

Track only active parity gaps between legacy canvas runtime and Phaser runtime.

## Open
- Phaser runtime now includes Level0 start-screen/dialogue flow, player prefab facing-state parity, walkable WASD movement with diagonal normalization, Level0 bounds plus Level1 transition triggering, Level1 to Level5 shells with dialogue/bounds/transition zones, Level5 non-combat victory corridor shell wiring, transition rule engine score/item predicates, a projectile base entity with parity movement/culling helpers, level-based shoot input gating (blocked in Level0, enabled in combat levels), and single-shot projectile parity for Level1 and Level2; dual/triple-shot variants, hit resolution, enemy/item lifecycle systems, and boss logic remain pending.
- Documentation artifacts currently track migration status only at wave/feature granularity; behavior-level parity evidence will be filled in as gameplay PRs land.

## Resolved
- PR-001 placeholder-only Phaser scene bootstrap replaced by explicit scene lifecycle shell in PR-002.
- PR-003 added a shared Phaser parity constants table for movement, bounds, score thresholds, and timer values sourced from legacy runtime behavior.
- PR-007 established canonical documentation scaffolding for handoffs, architecture flow, known limitations, and parity matrix governance.
- PR-008 introduced Level0 dialogue assets preload and Phaser scene state progression from start screen to dialogue sequence to post-dialogue walkable phase shell.
- PR-009 added Phaser player prefab and legacy direction-to-sprite facing-state mapping for all eight movement directions.
- PR-010 wired eight-direction movement updates with legacy diagonal normalization and key-precedence behavior for walkable Level0 state.
- PR-011 added Level0 walkable bounds checks and Level0-to-Level1 transition trigger detection using legacy threshold ratios.
- PR-012 added a Phaser Level1 shell with dialogue progression, Level1 movement bounds, Level1 background class switching, and Level1-to-Level2 transition zone detection.
- PR-013 added a Phaser Level2 shell with dialogue progression, Level2 movement bounds, Level2 background class switching, and Level2-to-Level3 transition zone detection.
- PR-014 added a Phaser Level3 shell with dialogue progression, Level3 movement bounds, Level3 background class switching, and Level3-to-Level4 transition zone detection.
- PR-015 added a Phaser Level4 shell with dialogue progression, Level4 movement bounds, Level4 background class switching, and Level4-to-Level5 transition zone detection.
- PR-016 added a Phaser Level5 shell with three-image dialogue progression, Level5 movement bounds, Level4-to-Level5 scene entry wiring, and non-combat victory shell trigger based on the legacy Level5 victory corridor.
- PR-017 wired a shared Phaser transition rule engine with legacy score-threshold and active-item-clear predicates for Level1 through Level5 progression checks.
- PR-018 added a Phaser projectile base entity and parity-tested projectile motion/world-culling helpers using legacy combat bound thresholds.
- PR-019 added level-based shoot input gating parity so Space-triggered shooting input is blocked in Level0 and emitted only for combat levels during walkable phases.
- PR-020 added single-shot projectile parity for Level1 and Level2 with legacy direction-based velocity mapping and diagonal normalization.
