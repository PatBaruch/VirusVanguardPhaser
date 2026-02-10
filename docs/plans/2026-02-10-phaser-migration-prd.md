# Phaser Migration PRD (Production Governance Contract)

> Purpose: This document is the execution contract for autonomous OpenCode agents migrating the existing canvas-based TypeScript game to Phaser.
>
> Workflow model: Ralph-style closed loop - Implement -> Test -> Verify -> If pass: handoff + merge -> If fail: debug -> repeat.

## Document Control

- Version: 2.0
- Date: 2026-02-10
- Program Owner: Senior TPM / Principal Engineer
- Execution Owner: OpenCode autonomous agents
- Status: Approved for execution
- Program Mode: Parity-first migration, micro-PR delivery

---

## 1. Objective

### 1.1 Primary Objective
Migrate the legacy canvas TypeScript game to Phaser with exact functional parity before any gameplay enhancements.

### 1.2 Parity Mandate
- Legacy behavior is the source of truth until parity milestone completion.
- No gameplay changes are allowed before parity completion, including:
  - movement feel
  - damage model
  - spawn cadence
  - scoring and progression
  - level transition rules
  - win/loss conditions

### 1.3 Delivery Order Mandate
Migration execution order is fixed to maximize control:
1. Main core logic and runtime foundation
2. Level traversal and player walkability
3. Shooting systems
4. Enemies one-by-one with the level where they belong
5. Boss fight systems last

### 1.4 Out-of-Scope Before Parity
- New mechanics
- Balance tuning not required for parity
- Art direction changes
- UX redesign not required for parity
- Performance optimizations that alter behavior

---

## 2. Execution Model (Ralph-Style Loop)

Every feature MUST execute through this exact cycle. No step is skippable.

### 2.1 Feature Selection Rules
- Select one feature unit at a time from the PR train in Section 9.
- Do not start PR N+1 until PR N is fully green and documented.
- If blocked by dependency, mark blocked with evidence and select next unblocked item approved by owner.

### 2.2 Implementation Constraints
- One feature unit per branch.
- Changes must be strictly scoped to selected PR.
- No mixed refactor + behavior change in the same PR.
- Preserve legacy parity behavior; if uncertainty exists, legacy implementation wins.
- Keep changes incremental and reversible.

### 2.3 Testing Requirements (Per PR)
- Implement tests for feature scope.
- Execute all required quality gates (Section 5).
- Include proof artifacts in PR and handoff.

### 2.4 Failure Handling Logic
If any gate fails:
1. Analyze failure and capture root-cause hypothesis.
2. Apply smallest viable fix.
3. Re-run failed tests.
4. Re-run full gate suite.
5. Repeat until all gates pass.

No soft pass and no manual override are permitted.

### 2.5 Iteration Rules
- A PR is complete only when all gates pass and documentation is updated.
- A partially green PR remains in progress.
- No merge allowed on red gates.

### 2.6 Handoff Generation Rules
After all gates pass, the agent MUST generate a handoff document before merge using the template in Section 8.

---

## 3. Feature Unit Definition

A feature unit is the smallest migration slice that is:
- independently implementable
- independently testable
- independently reviewable
- merge-safe without parity regression

### 3.1 Valid Feature Unit Examples
- Player movement system
- Bullet collision system
- Level 0 traversal logic
- Enemy spawn logic for a single level
- Boss health and boss attack logic
- UI rendering layer

### 3.2 Mandatory Feature Metadata
Each feature unit MUST define:
- `Feature ID`
- `REQ-ID`
- `Owner`
- `Status` (`planned`, `in_progress`, `blocked`, `passed`, `merged`)
- `Health` (`on_track`, `at_risk`, `off_track`)
- Legacy reference files and behavior source
- In-scope behavior
- Out-of-scope behavior
- Acceptance criteria
- Required tests
- Runtime verification scenario
- Documentation updates

### 3.3 Traceability Requirements
Each PR MUST link:
- Requirement -> Implementation -> Tests

Required trace fields per PR:
- `REQ-ID` (requirement)
- `ARCH-ID` (architecture item, if applicable)
- `IMPL-ID` (implementation work item)
- `TEST-ID` list

No merge if traceability links are missing.

---

## 4. PR Size and Scope Governance

### 4.1 Micro-PR Policy
- One behavior slice per PR.
- Target net diff: 50-250 LOC (exceptions require explicit justification).
- Target touched files: 3-8 files (exceptions require explicit justification).

### 4.2 Scope Creep Policy
- If additional behavior is discovered during implementation, split into a follow-up PR.
- Do not expand current PR scope without owner approval.

### 4.3 Merge Blocking Rules
- Red tests: hard block.
- Missing handoff: hard block.
- Missing traceability links: hard block.
- Missing parity evidence for parity-scoped PR: hard block.

---

## 5. Quality Control Gates (MANDATORY)

Each PR must pass all four gates. Failure of any gate requires debug-and-retry loop.

### 5.A Static Gate
Pass criteria:
- TypeScript compile passes
- ESLint passes
- No new warnings introduced

Required checks:
- `npm run build`
- `npm run lint`
- warning delta must be zero vs baseline

### 5.B Behavioral Gate
Pass criteria:
- Unit tests exist and pass for feature logic
- Parity tests pass where applicable
- No regression in existing tests

Required checks:
- `npm run test:unit`
- `npm run test:parity` (or equivalent scoped parity suite)

### 5.C Runtime Gate
Pass criteria:
- Game loads successfully
- No browser console errors during scenario
- Core interaction for feature is verified

Required checks:
- `npm run test:e2e`
- Console log assertions in runtime tests

### 5.D Documentation Gate
Pass criteria:
- Handoff document generated
- Current architecture diagram updated
- Known limitations documented

Required artifacts:
- `docs/handoffs/<date>-<feature-id>-<slug>.md`
- `docs/architecture/phaser-migration.mmd` (or equivalent canonical architecture doc)
- `docs/parity/known-limitations.md`

---

## 6. Testing Strategy

### 6.1 Unit and Logic Testing (Vitest)
Use Vitest for deterministic logic-level validation:
- movement vectors and bounds
- collision and damage rules
- spawn timers and cadence
- score and state transitions

### 6.2 Runtime and Parity Testing (Playwright)
Use Playwright for browser-level validation:
- boot sequence
- scene loading
- input handling
- critical interactions per feature

### 6.3 Screenshot Comparison
For visual parity-sensitive features:
- baseline screenshots from legacy runtime
- comparison screenshots from Phaser runtime
- approved tolerance threshold documented in parity matrix

### 6.4 Deterministic Input Replay
Maintain replay fixtures:
- fixed input timeline with timestamps
- identical replay duration for legacy and Phaser
- compare resulting state outputs

### 6.5 Delta Timing Validation
Validate timing-sensitive systems:
- update cadence
- cooldown behavior
- spawn intervals
- transition timing

Timing variance tolerance must be explicitly defined per feature in parity tests.

---

## 7. Git and PR Protocol

### 7.1 Branch Protocol
- One feature per branch
- Naming format: `feat/phaser-parity/<pr-id>-<slug>`

### 7.2 Commit Protocol
Required commit message format:
- `feat(parity:<pr-id>): implement <feature-name>`
- `test(parity:<pr-id>): add/adjust tests for <feature-name>`
- `docs(parity:<pr-id>): add handoff and parity evidence`

### 7.3 PR Template (Required Structure)
Every PR MUST contain:
1. PR ID and title
2. REQ-ID / ARCH-ID / IMPL-ID / TEST-ID list
3. Legacy behavior targeted
4. Scope and non-scope
5. Files added/modified
6. Gate results summary
7. Test evidence (commands, outputs, artifacts)
8. Known limitations
9. Rollback plan

### 7.4 Required PR Checklist
- [ ] Static gate passed
- [ ] Behavioral gate passed
- [ ] Runtime gate passed
- [ ] Documentation gate passed
- [ ] No mixed refactor + behavior change
- [ ] No red tests
- [ ] Parity confirmation included
- [ ] Traceability links complete

---

## 8. Handoff Document Template (Required After Every Green PR)

Each completed PR MUST produce:
`docs/handoffs/<date>-<pr-id>-<slug>.md`

### Feature Handoff
- Feature name:
- PR ID:
- REQ-ID:
- ARCH-ID:
- IMPL-ID:
- TEST-ID list:
- Branch:
- PR:

### What Changed
- Summary of migrated behavior
- Legacy behavior matched

### Files Added/Modified
- Added:
- Modified:
- Deleted:

### Test Coverage Summary
- Unit tests added/updated:
- Parity tests added/updated:
- Runtime tests added/updated:
- Full suite status:

### Quality Gate Results
- Static Gate: PASS/FAIL
- Behavioral Gate: PASS/FAIL
- Runtime Gate: PASS/FAIL
- Documentation Gate: PASS/FAIL

### Known Edge Cases and Limitations
- Edge cases:
- Limitations:
- Risk notes:

### Parity Confirmation
- Parity scope confirmed:
- Evidence links:
- Remaining parity gaps:

### Next Recommended PR
- Next PR ID:
- Rationale:
- Dependencies:

---

## 9. Planned PR Train (Locked Order)

### Wave A - Core Runtime and Governance
- `PR-001` Phaser dual-runtime bootstrap (legacy untouched)
- `PR-002` Scene lifecycle shell (`Boot`, `Preload`, `Game` skeleton)
- `PR-003` Shared constants parity table (movement, bounds, timers)
- `PR-004` ESLint config + `npm run lint` + warning baseline policy
- `PR-005` Vitest setup + first core logic tests
- `PR-006` Playwright setup + boot smoke + console-error guard
- `PR-007` Docs scaffolding (`handoffs`, architecture, known limitations, parity matrix)

### Wave B - Walkable Levels First (No Shooting/Enemies)
- `PR-008` Level0 scene visuals + dialogue progression parity
- `PR-009` Player prefab + facing-direction states parity
- `PR-010` 8-direction movement + diagonal normalization parity
- `PR-011` Level0 bounds + transition trigger to Level1 parity
- `PR-012` Level1 shell (background, dialogue, bounds, transition zone)
- `PR-013` Level2 shell (same pattern)
- `PR-014` Level3 shell (same pattern)
- `PR-015` Level4 shell (same pattern)
- `PR-016` Level5 shell + non-combat victory shell wiring
- `PR-017` Transition rule engine wiring (score/item predicates wired only)

### Wave C - Shooting Systems
- `PR-018` Projectile base entity + movement + world culling
- `PR-019` Shoot input gating (disabled in Level0, enabled in combat levels)
- `PR-020` Single-shot pattern parity (Level1-2)
- `PR-021` Dual-shot pattern parity (Level3)
- `PR-022` Triple-shot pattern parity (Level4-5)
- `PR-023` Bullet hit resolution + death effect + score hook

### Wave D - Enemies by Level (One-by-One)
- `PR-024` Level1 `FEmail`: spawn cadence + collision/damage/score + clear gate (>=200)
- `PR-025` Level2 `RVirus`: spawn + stick-to-player + periodic HP drain + clear gate (>=400)
- `PR-026` Level3 `Worm`: spawn + duplication timer + clear gate (>=600)
- `PR-027` Level4 `Trojan`: spawn + breach damage + split-spawn-on-hit + clear gate (>=1000)
- `PR-028` Enemy collision matrix hardening for Levels1-4

### Wave E - Boss Fight Last
- `PR-029` Level5 `MrHacker`: spawn + HP model + health bar parity
- `PR-030` Boss bullet firing + enemy bullet collision/damage parity
- `PR-031` Boss minion spawn cycle parity (`FEmail` / `RVirus` / `Worm`)
- `PR-032` Boss defeat + win flow + final multiplier + restart parity

### Wave F - Cutover and Decommission
- `PR-033` Full parity matrix run + stabilization fixes only
- `PR-034` Switch default runtime to Phaser; retain legacy fallback flag
- `PR-035` Remove legacy runtime after one stable cycle without P0/P1 regressions

---

## 10. Failure Loop Rules (Strict)

If tests or gates fail, the agent MUST execute the following loop:
1. Analyze failure output.
2. Generate explicit root-cause hypothesis.
3. Implement targeted fix.
4. Re-run failed tests.
5. Re-run full quality gates.
6. Repeat until all green.

Constraints:
- No skipping failed tests.
- No reducing test assertions to force pass.
- No partial merge with unresolved failures.
- No manual "looks fine" acceptance.

---

## 11. Non-Negotiable Rules

- No mixing refactor + behavior change in one PR.
- No merging red tests.
- No manual "it seems fine" acceptance.
- Evidence-based completion only.
- No skipping any mandatory quality gate.
- No gameplay changes before parity milestone sign-off.

---

## 12. Operational Loop (Executable Pseudocode)

```text
for pr in planned_pr_train:
    checkout_branch(pr)
    implement(pr.scope)
    run_static_gate()
    run_behavioral_gate()
    run_runtime_gate()
    run_docs_gate()

    while any_gate_failed:
        analyze_failure()
        generate_hypothesis()
        implement_minimal_fix()
        rerun_failed_gate()
        rerun_full_gates()

    write_handoff(pr)
    update_traceability_links(pr)
    open_pr_with_evidence(pr)
    merge_if_all_green()
```
