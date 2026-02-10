# Known Parity Limitations

Track only active parity gaps between legacy canvas runtime and Phaser runtime.

## Open
- Phaser runtime has parity constants defined, but those values are not wired into movement, level bounds enforcement, transition checks, or timers yet.
- Phaser runtime currently includes Level0 start-screen and dialogue progression visuals only; walkable traversal, movement, level transitions, shooting, enemies, and boss logic remain pending.
- Documentation artifacts currently track migration status only at wave/feature granularity; behavior-level parity evidence will be filled in as gameplay PRs land.

## Resolved
- PR-001 placeholder-only Phaser scene bootstrap replaced by explicit scene lifecycle shell in PR-002.
- PR-003 added a shared Phaser parity constants table for movement, bounds, score thresholds, and timer values sourced from legacy runtime behavior.
- PR-007 established canonical documentation scaffolding for handoffs, architecture flow, known limitations, and parity matrix governance.
- PR-008 introduced Level0 dialogue assets preload and Phaser scene state progression from start screen to dialogue sequence to post-dialogue walkable phase shell.
