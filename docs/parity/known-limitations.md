# Known Parity Limitations

Track only active parity gaps between legacy canvas runtime and Phaser runtime.

## Open
- Phaser runtime now has `BootScene -> PreloadScene -> GameScene` lifecycle shell only; no gameplay entities, level logic, or asset preload parity yet.

## Resolved
- PR-001 placeholder-only Phaser scene bootstrap replaced by explicit scene lifecycle shell in PR-002.
