# AGENTS.md
Guidance for autonomous coding agents working in `VirusVanguardPhaser`.
This file reflects current commands, conventions, and constraints.

## 1) Repository Snapshot
- Language: TypeScript (`type: module` in `package.json`).
- Runtime target: browser game using HTML canvas.
- Build output: `build/` produced by TypeScript compiler.
- Entry page: `index.html` loading `build/app.js`.
- Source root: `src/`.
- Package manager: npm (`package-lock.json` exists).
- Testing: Vitest is configured for unit tests (`npm run test:unit`).
- Linting: ESLint is configured via `.eslintrc.cjs`.
- Autonomous loop harness: `@th0rgal/ralph-wiggum` (dev dependency), Bun runtime required.
- Migration governance doc: `docs/plans/2026-02-10-phaser-migration-prd.md`.

## 2) Rule Sources (Cursor/Copilot)
Check these at task start:
- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

Current repository status:
- No Cursor rules found.
- No Copilot instructions found.

Agent behavior requirements:
- Re-check rule files at the start of each task.
- If rules appear later, treat them as high-priority instructions.
- Keep this `AGENTS.md` aligned when those rule files are added or changed.

## 3) Setup And Core Commands
Run all commands from repository root:
`/Users/pbaruch/Desktop/VirusVanguardPhaser`

### Install dependencies
```bash
npm ci
```
If lockfile updates are intentional:
```bash
npm install
```

### Build (official)
```bash
npm run build
```
Runs `tsc` and emits JavaScript into `build/`.

### Watch mode (official)
```bash
npm run watch
```

### Run locally in browser
No dedicated serve script exists.
Use any static file server, then open `index.html`.
Example:
```bash
npx serve .
```

### Ralph overnight loop tooling
Prerequisites:
- Bun runtime available (`~/.bun/bin` in `PATH`)
- `opencode` CLI installed and authenticated

Run loop:
```bash
npm run ralph:overnight
```

Run loop with explicit iteration cap:
```bash
npm run ralph:overnight -- 40
```

Monitor and control:
```bash
npm run ralph:status
npm run ralph:add-context -- "Focus on PR-010 only"
npm run ralph:clear-context
```

## 4) Lint/Test Commands (Current + Fallbacks)
### Lint
- ESLint is configured via `.eslintrc.cjs` for TypeScript source under `src/`.
- Project lint script:
```bash
npm run lint
```
- Warning baseline policy: lint must run with zero warnings (`--max-warnings 0`).

### Tests
- Unit test framework: Vitest.
- Runtime e2e framework: Playwright.
- Project unit test script:
```bash
npm run test:unit
```
- Project e2e test script:
```bash
npm run test:e2e
```
- First core logic suite currently lives in `src/phaser/config/parityConstants.spec.ts`.
- Boot smoke + console guard suite lives in `e2e/boot-smoke.spec.ts`.
- `tsconfig.json` excludes `**/*.spec.ts` from compile output.
- Do not claim tests pass unless the Vitest suite is run.

### Single-test execution (important)
Run a single Vitest file/test with:
- `npm run test:unit -- src/phaser/config/parityConstants.spec.ts`
- `npm run test:unit -- src/phaser/config/parityConstants.spec.ts -t "matches movement parity constants"`

For narrow verification without a test harness:
```bash
npx tsc --noEmit
```

## 5) Codebase Map
- `src/app.ts`: app bootstrap; creates game instance and starts on window load.
- `src/VirusVanguard.ts`: top-level game orchestration (`Game` subclass).
- `src/Game.ts`: abstract game loop and lifecycle state machine.
- `src/Level.ts`: core gameplay behavior (input, movement, collision, spawning).
- `src/Level0.ts` ... `src/Level5.ts`: level-specific progression and setup.
- `src/GameItem/`: concrete entities (enemies, bullets, effects).
- `src/CanvasRenderer.ts`: canvas helpers (drawing primitives, image loading, text).
- `assets/`: sprites/backgrounds and other game art.
- `index.html`: canvas host and inline page styling.

## 6) Style Guide From Existing Code
Follow existing patterns unless task explicitly requests refactor.

### Imports
- Use relative imports.
- In `.ts` files, import local modules with `.js` extension.
- Keep imports at file top.
- Import ordering is not strictly enforced; keep nearby style consistent.

### Formatting
- Use 2-space indentation.
- Prefer semicolons.
- Use multi-line argument lists for long calls/signatures.
- Keep braces and control-flow style consistent (`if (...) { ... }`).

### Types
- Add explicit visibility (`public`/`private`/`protected`) on members.
- Use explicit type annotations for fields, params, and return types.
- Local variables are often explicitly typed; follow that style in touched code.
- Respect compiler constraints: `noImplicitAny`, `noImplicitThis`, `noImplicitOverride`, `noImplicitReturns`.
- `strict` is `false`; avoid introducing `any` unless unavoidable.

### Naming
- Classes/interfaces/types: `PascalCase`.
- Methods/variables/fields: `camelCase`.
- Constants (`static readonly` key codes/states): UPPER_SNAKE_CASE.
- Keep filename conventions already used in the area you edit.

### OOP Patterns
- Prefer extending existing abstractions (`Game`, `Level`, `CanvasItem`, `GameItem`).
- Avoid introducing parallel systems when extension points already exist.
- Use `override` in subclasses where applicable.

### Error Handling And Logging
- Throw explicit `Error` for impossible runtime states.
- Validate browser API assumptions where needed (e.g., canvas context).
- Avoid `console.log` in gameplay loops unless debugging is requested.

### Comments And Docs
- JSDoc-style comments are common on classes/methods.
- Add comments only for non-obvious behavior.
- Keep comments accurate and concise.

### Assets And Paths
- Preserve surrounding asset path style (`./assets` vs `../assets`).
- Verify path base when loading sprites from nested modules.

## 7) Change Safety Checklist
- Read surrounding code before editing; gameplay logic is tightly coupled.
- Avoid broad refactors unless explicitly required.
- Keep per-frame performance in mind; avoid heavy allocations in update loops.
- After edits, run `npm run build` as minimum verification.
- If you add lint/test tooling, document exact commands in your summary.
- If Cursor/Copilot rules are introduced, update this file accordingly.

## 8) Definition Of Done
- Code compiles with `npm run build`.
- Behavior matches the requested gameplay/UI change.
- No unrelated files are unintentionally changed.
- New scripts/commands are documented in this file.
- This `AGENTS.md` stays consistent with repository state.

## 9) Phaser Migration Plan (PRD-Driven Micro-PR)
Goal: migrate the current canvas game to Phaser with behavior parity first, then enable new features.

Source of truth:
- `docs/plans/2026-02-10-phaser-migration-prd.md`

Execution order is locked:
1. Core runtime and governance
2. Walkable levels and traversal parity
3. Shooting systems parity
4. Enemies one-by-one on the levels where they appear
5. Boss fight systems last
6. Cutover and legacy decommission

### Micro-PR policy
- One behavior slice per PR.
- Keep PRs very small and independently reviewable.
- No mixed refactor + behavior change.
- No merge without evidence-backed parity checks.

### Runtime and filesystem targets
- New runtime root: `src/phaser/`
- Suggested structure:
  - `src/phaser/scenes/`
  - `src/phaser/entities/`
  - `src/phaser/systems/`
  - `src/phaser/config/`
  - `src/phaser/adapters/`

### Mandatory artifacts per passing PR
- `docs/handoffs/<date>-<pr-id>-<slug>.md`
- `docs/parity/known-limitations.md`
- `docs/architecture/phaser-migration.mmd`

## 10) Overnight Ralph Loop Contract (Mandatory)

When running `npm run ralph:overnight`, agent behavior is mandatory:

### Task selection and scope
- Use `.ralph/ralph-tasks.md` as the authoritative task list.
- Work one task at a time in PR order.
- Task state transitions:
  - `[ ]` -> `[/]` when started
  - `[/]` -> `[x]` only after all required gates pass

### Per-iteration execution loop
1. Select next unchecked PR task.
2. Implement only that PR scope.
3. Run required gates.
4. If any gate fails: debug and retry until green.
5. Write handoff file.
6. Mark task complete.
7. Commit.

### Staged gates (bootstrap-aware)
Because lint/unit/e2e are introduced in early PRs, use staged gates:
- PR-001 to PR-003: `npm run build` and `npx tsc --noEmit`
- PR-004 and later: add lint gate (`npm run lint` once created)
- PR-005 and later: add unit test gate (`npm run test:unit` once created)
- PR-006 and later: add e2e gate (`npm run test:e2e` once created)

Never skip an available gate.

### Commit and documentation rules
- Commit format: `feat(parity:PR-XXX): <summary>`
- Every passing task must include a handoff file.
- Update known limitations and architecture docs when relevant.

### Stop condition
- Output completion only when all tasks in `.ralph/ralph-tasks.md` are `[x]`.

## 11) Morning Review Checklist (After Overnight Run)
- Check task completion state: `.ralph/ralph-tasks.md`
- Check loop status history: `npm run ralph:status`
- Review recent commits and touched files
- Re-run minimum verification manually before accepting output:
  - `npm run build`
  - additional gates if available
