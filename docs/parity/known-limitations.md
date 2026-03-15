# Known Parity Limitations

Track only active parity gaps between legacy canvas runtime and Phaser runtime.

## Open
- Level3 Worm duplication timing is intentionally tuned to `3000ms` in Phaser for playability, versus the legacy `2000ms` cadence.
- No active governance gaps are currently open.

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
- PR-021 added dual-shot projectile parity for Level3 with legacy directional spawn offsets and velocity mapping.
- PR-022 added triple-shot projectile parity for Level4 and Level5 with legacy directional spread vectors and spawn offsets.
- PR-023 added projectile hit-resolution parity logic with AABB collision handling, death-effect spawn emission on each bullet impact, and score-delta hooks when targets are defeated.
- PR-024 added Level1 FEmail enemy integration with parity spawn cadence, movement/bounce bounds, bullet-hit score hookups, player-contact damage handling, and active-enemy clear-gate wiring for Level1-to-Level2 transition checks.
- PR-025 added Level2 RVirus enemy integration with parity spawn cadence, player stick-to-target behavior, periodic player HP drain while attached, projectile-hit score hooks, and active-enemy clear-gate wiring for Level2-to-Level3 transition checks.
- PR-026 added Level3 Worm enemy integration with parity spawn cadence, 2000ms duplication timing, projectile-hit score hooks, and active-enemy clear-gate wiring for Level3-to-Level4 transition checks.
- PR-027 added Level4 Trojan enemy integration with parity 2000ms spawn cadence, left-boundary breach damage, split-spawn behavior on projectile hit and breach, and active-enemy clear-gate wiring for Level4-to-Level5 transition checks.
- PR-028 hardened the Level1 to Level4 enemy collision matrix by centralizing player-contact collision rules and wiring Worm and Trojan player-contact damage/removal paths in Phaser combat updates.
- PR-029 added Level5 MrHacker boss spawn integration with legacy HP model values, boss sprite preload/animation shell wiring, and health-bar frame mapping that tracks boss HP over the legacy 0..25 range.
- PR-030 added Level5 MrHacker three-way boss bullet volley logic (dominant-axis targeting with legacy random angle spread), enemy bullet entity/runtime motion wiring, and enemy-bullet-versus-player collision damage hooks.
- PR-031 added Level5 MrHacker minion spawn-cycle parity with legacy 3000ms cadence, random FEmail/RVirus/Worm bucket selection, legacy spawn offsets from boss position, and runtime combat-loop integration that keeps spawned minions active before and after boss defeat.
- PR-032 added Level5 boss defeat and win-flow parity with final multiplier decay/freeze behavior, go-next-level combat-clear visual state, legacy victory summary text (score, multiplier, final score), and Space-key restart handling from victory state.
- PR-033 completed a full parity matrix verification run (build, lint, unit, and e2e gates) and recorded stabilization status with no new parity regressions detected.
- PR-034 switched default boot to Phaser runtime while retaining the legacy canvas fallback flag at `?runtime=legacy`.
- PR-035 removed the legacy canvas runtime and fallback selector wiring; boot now always starts Phaser runtime.
- PR-036 added Playwright end-to-end traversal journey coverage from Level0 start state through Level5 reachability checkpoints, including score-gated transition preconditions for Levels1 to 5.
- PR-037 added Playwright end-to-end combat interaction coverage for early-level combat behavior, including shoot-input projectile spawning, projectile hit score progression, and player damage from enemy collisions in Level1.
- PR-038 added Playwright long-run runtime soak coverage with sustained movement and shoot input, including explicit console-error and page-error assertions over an extended browser interaction window.
- PR-039 validated end-to-end PRD traceability artifacts across handoffs, parity matrix, and known limitations; repaired missing handoff metadata (`Date`) for PR-030 through PR-038 and reconciled parity documentation coverage through Wave G.
- PR-040 added GitHub Actions CI workflow gates for build, lint, unit tests, and e2e tests to support required merge-check enforcement.
- PR-041 fixed level-entry state polish by resetting east-facing player entry and refreshing the lit Level5 arena backdrop as combat clear-state changes.
- PR-042 hardened Level2 RVirus attachment handling so additional overlapping RVirus now damage and despawn instead of ghosting through the player.
- PR-043 tuned Level3 worm duplication pressure from 2000ms to 3000ms to keep the level playable; this remains an intentional open parity deviation from legacy timing.
- PR-044 added Phaser combat feedback effects: Death-sprite enemy death animations on lethal kills and visible player damage flash feedback.
- PR-047 added a short player recovery window after damage so immediate re-hit chains are suppressed, and surfaced the recovering state through sustained overlay feedback plus runtime-testable player state metadata.
