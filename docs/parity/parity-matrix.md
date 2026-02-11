# Phaser Parity Matrix

| Area | Legacy Status | Phaser Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| Core bootstrap | Baseline established | In progress | `docs/handoffs/2026-02-11-pr-001-phaser-dual-runtime-bootstrap.md`, `docs/handoffs/2026-02-11-pr-002-scene-lifecycle-shell.md` | Dual runtime selector and Phaser scene shell are implemented. |
| Shared constants | Baseline established | In progress | `docs/handoffs/2026-02-11-pr-003-shared-constants-parity-table.md` | Constants are mapped; wiring to gameplay systems is pending. |
| Quality gates | Baseline established | Baseline established | `docs/handoffs/2026-02-11-pr-004-eslint-config-lint-baseline.md`, `docs/handoffs/2026-02-11-pr-005-vitest-setup-core-logic-tests.md`, `docs/handoffs/2026-02-11-pr-006-playwright-setup-boot-smoke-console-guard.md` | Static, unit, and runtime gates are active in pipeline. |
| Docs governance | Baseline established | Baseline established | `docs/handoffs/TEMPLATE.md`, `docs/architecture/phaser-migration.mmd`, `docs/parity/known-limitations.md` | Canonical docs scaffolding is established in PR-007. |
| Player movement | Baseline established | In progress | `docs/handoffs/2026-02-11-pr-009-player-prefab-facing-direction-states.md`, `docs/handoffs/2026-02-11-pr-010-8-direction-movement-diagonal-normalization.md`, `docs/handoffs/2026-02-11-pr-011-level0-bounds-transition-trigger.md` | PR-011 adds legacy Level0 bounds gating on top of PR-010 movement vectors and key precedence. |
| Level traversal | Legacy reference only | In progress | `docs/handoffs/2026-02-11-pr-008-level0-scene-visuals-dialogue-progression.md`, `docs/handoffs/2026-02-11-pr-009-player-prefab-facing-direction-states.md`, `docs/handoffs/2026-02-11-pr-010-8-direction-movement-diagonal-normalization.md`, `docs/handoffs/2026-02-11-pr-011-level0-bounds-transition-trigger.md` | Level0 visual/dialogue shell, walkable bounds, and Level1 transition trigger parity are in place; Level1 to Level5 scene shells and traversal-rule engine wiring remain planned in PR-012 to PR-017. |
| Shooting patterns | Legacy reference only | Not started | - | Planned in PR-018 to PR-023. |
| Enemies by level | Legacy reference only | Not started | - | Planned in PR-024 to PR-028. |
| Boss fight | Legacy reference only | Not started | - | Planned in PR-029 to PR-032. |
