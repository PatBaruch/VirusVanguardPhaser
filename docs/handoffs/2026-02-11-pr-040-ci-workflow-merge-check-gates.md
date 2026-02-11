# Feature Handoff
- Feature name: Add CI workflow gate for build, lint, unit, and e2e as required merge checks
- PR ID: PR-040
- REQ-ID: PRD-9-PR-040
- ARCH-ID: ARCH-PHASER-MIGRATION-GOVERNANCE
- IMPL-ID: IMPL-PR-040-CI-REQUIRED-MERGE-CHECKS
- TEST-ID list: TEST-PR-040-STATIC-BUILD, TEST-PR-040-STATIC-LINT, TEST-PR-040-UNIT-FULL-SUITE, TEST-PR-040-RUNTIME-E2E
- Branch: current working branch
- PR: pending
- Date: 2026-02-11

# What Changed
- Added a GitHub Actions workflow at `.github/workflows/ci.yml` that runs on pull requests and pushes to `main`.
- Implemented four explicit CI jobs aligned to required gates: `Build`, `Lint`, `Unit Tests`, and `E2E Tests`.
- Configured each job to use Node 20 with npm cache, install dependencies via `npm ci`, and run the project gate command.
- Added Playwright browser installation in CI before e2e execution so browser runtime dependencies are present in GitHub-hosted runners.
- Updated parity known limitations to close the PR-040 governance gap.

# Files Added/Modified
- Added:
  - `.github/workflows/ci.yml`
  - `docs/handoffs/2026-02-11-pr-040-ci-workflow-merge-check-gates.md`
- Modified:
  - `.ralph/ralph-tasks.md`
  - `docs/parity/known-limitations.md`
- Deleted:
  - None.

# Test Coverage Summary
- Unit tests added/updated:
  - None.
- Parity tests added/updated:
  - None.
- Runtime tests added/updated:
  - None.
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
  - Handoff added and known limitations updated for PR-040 governance closure.

# Exact Verification Commands Run
- `npm run build`
- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`

# Known Edge Cases and Limitations
- Edge cases:
  - Repository-level branch protection/ruleset selection of required checks is configured in GitHub settings and is not represented in-repo.
- Limitations:
  - CI job enforcement as merge blockers depends on repository settings requiring these workflow checks.
- Risk notes:
  - Renaming workflow job names later will require matching updates in branch protection required-check configuration.

# Parity Confirmation
- Parity scope confirmed:
  - PR-040 scope is complete with CI gates for build, lint, unit tests, and e2e tests now defined in versioned workflow configuration.
- Evidence links:
  - `.github/workflows/ci.yml`
  - `docs/parity/known-limitations.md`
  - `docs/architecture/phaser-migration.mmd`
- Remaining parity gaps:
  - None.

# Next Recommended PR
- Next PR ID: none (PR train complete)
- Rationale:
  - PR-040 is the final locked task in Wave G and closes the remaining governance gap.
- Dependencies:
  - None.
