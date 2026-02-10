# Known Parity Limitations

Track only active parity gaps between legacy canvas runtime and Phaser runtime.

## Open
- Phaser runtime has parity constants defined, but those values are not wired into movement, level bounds enforcement, transition checks, or timers yet.
- Phaser runtime still has no gameplay entities, traversal logic, shooting, enemies, boss logic, or asset preload parity.
- Documentation artifacts currently track migration status only at wave/feature granularity; behavior-level parity evidence will be filled in as gameplay PRs land.

## Resolved
- PR-001 placeholder-only Phaser scene bootstrap replaced by explicit scene lifecycle shell in PR-002.
- PR-003 added a shared Phaser parity constants table for movement, bounds, score thresholds, and timer values sourced from legacy runtime behavior.
- PR-007 established canonical documentation scaffolding for handoffs, architecture flow, known limitations, and parity matrix governance.
