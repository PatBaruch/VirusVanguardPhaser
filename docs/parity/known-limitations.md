# Known Parity Limitations

Track only active parity gaps between legacy canvas runtime and Phaser runtime.

## Open
- Phaser runtime now includes Level0 start-screen/dialogue flow, player prefab facing-state parity, walkable WASD movement with diagonal normalization, Level0 bounds plus Level1 transition triggering, and Level1 to Level3 shells with dialogue/bounds/transition zones; dedicated Level4 to Level5 scene shells, shooting, enemies, and boss logic remain pending.
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
