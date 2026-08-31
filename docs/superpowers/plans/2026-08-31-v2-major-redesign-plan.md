# v2.0.0 Major Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize `react-text-rotator` to v2.0.0 with TypeScript, `tsup`, React 18 & 19 support, rich content rendering (ReactNodes/custom render functions), bug-free timer management (fixing Issue #58 & #50), `react-doctor` quality auditing, and unified AI agent instructions (`AGENTS.md`).

**Architecture:** Convert `src/` to TypeScript (`.ts`/`.tsx`), use `tsup` to bundle CommonJS, ES Modules, and Type Definitions. Refactor `useRotator` hook with explicit `useRef` timer cleanup routines and visibility change handlers. Export both `TextRotator` component and `useRotator` hook. Create `AGENTS.md` as the canonical AI instruction document and set up lightweight pointer files (`CLAUDE.md`, `OPENCODE.md`, `COPILOT.md`, `AGY.md`).

**Tech Stack:** React 18/19, TypeScript 5, tsup, Jest, react-transition-group v4, react-doctor, ESLint 9/8.

## Global Constraints
- Peer dependencies: `"react": "^18.0.0 || ^19.0.0"`, `"react-dom": "^18.0.0 || ^19.0.0"`, `"react-transition-group": "^4.4.0"`.
- Output formats in `dist/`: `index.js` (CJS), `index.mjs` (ESM), `index.d.ts` (Types).
- Zero memory leaks: All timeouts and intervals must be safely cleared in `useRotator` cleanup without short-circuit expressions.
- Canonical AI instruction file: `AGENTS.md`.

---

### Task 1: Package Infrastructure & Tooling Setup

**Files:**
- Modify: `package.json`
- Create: `tsconfig.json`
- Create: `tsup.config.ts`

**Interfaces:**
- Consumes: None
- Produces: `npm run build` (tsup), `npm run doctor` (react-doctor), `npm run typecheck`, `npm test`

- [ ] **Step 1: Update package.json scripts and dependencies**

Update `package.json` to include `tsup`, `typescript`, `@types/react`, `@types/react-dom`, `@types/jest`, `react-doctor`, and updated scripts (`build`, `dev`, `doctor`, `typecheck`).

- [ ] **Step 2: Create tsconfig.json**

Configure TypeScript for library compilation with React JSX support, strict mode, and type declaration emission.

- [ ] **Step 3: Create tsup.config.ts**

Configure `tsup` to entry `src/index.ts`, output formats `cjs` and `esm`, dts generation, clean dist folder, and mark `react`, `react-dom`, `react-transition-group` as external.

- [ ] **Step 4: Verify tooling installation & build dry-run**

Run: `npm install && npm run typecheck`
Expected: Success or empty type check prior to file renaming.

- [ ] **Step 5: Commit infrastructure configuration**

```bash
git add package.json package-lock.json tsconfig.json tsup.config.ts
git commit -m "chore: setup tsup, typescript, and react-doctor tooling for v2.0.0"
```

---

### Task 2: Unified AI Agent Instructions (`AGENTS.md` and Pointers)

**Files:**
- Create: `AGENTS.md`
- Create/Modify: `CLAUDE.md`
- Create: `OPENCODE.md`
- Create: `COPILOT.md`
- Create: `AGY.md`

**Interfaces:**
- Consumes: Developer workflow & tooling commands from Task 1
- Produces: Unified agent instructions document and pointer files for all AI tools.

- [ ] **Step 1: Create AGENTS.md**

Write `AGENTS.md` at root with repository overview, build/test/lint commands, `react-doctor` mandatory checks, code conventions, and architecture summary.

- [ ] **Step 2: Create pointer files CLAUDE.md, OPENCODE.md, COPILOT.md, AGY.md**

Write pointer markdown files pointing to `AGENTS.md` using the format:
```markdown
# AI Agent Instructions
See [AGENTS.md](./AGENTS.md) for full project instructions, developer commands, architecture, and coding standards.
```

- [ ] **Step 3: Commit AI agent instructions**

```bash
git add AGENTS.md CLAUDE.md OPENCODE.md COPILOT.md AGY.md
git commit -m "docs: add unified AGENTS.md canonical instructions and pointer files"
```

---

### Task 3: TypeScript Types & Timer-Safe `useRotator` Hook

**Files:**
- Create: `src/types.ts`
- Create/Modify: `src/useRotator.ts` (replaces `src/useRotator.js`)
- Test: `tests/useRotator.test.ts`

**Interfaces:**
- Consumes: `RotatorItem`, `UseRotatorOptions`, `UseRotatorReturn` from `src/types.ts`
- Produces: `useRotator` hook exported from `src/useRotator.ts`

- [ ] **Step 1: Create src/types.ts**

Define `RotatorItem`, `TextRotatorProps`, `UseRotatorOptions`, `UseRotatorReturn` interfaces.

- [ ] **Step 2: Write failing unit test for timer cleanup in useRotator**

Create `tests/useRotator.test.ts` asserting that unmounting the hook clears all active timeouts and intervals without throwing memory leak or state update warnings.

- [ ] **Step 3: Run test to verify failure**

Run: `npx jest tests/useRotator.test.ts`
Expected: FAIL (file or exported hook not found yet)

- [ ] **Step 4: Implement src/useRotator.ts in TypeScript**

Implement `useRotator` using `useRef` for timer IDs (`itemTimeoutRef`, `itemIntervalRef`, `displayTimeoutRef`), explicit non-short-circuiting cleanup, and `visibilitychange` window listener to pause rotation when page is hidden.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx jest tests/useRotator.test.ts`
Expected: PASS

- [ ] **Step 6: Commit useRotator implementation**

```bash
git add src/types.ts src/useRotator.ts tests/useRotator.test.ts
git commit -m "refactor: implement timer-safe useRotator hook in TypeScript"
```

---

### Task 4: `TextRotator` Component & Rich Content Support

**Files:**
- Create/Modify: `src/transitions.ts` (replaces `src/transitions.js`)
- Create/Modify: `src/index.ts` and `src/TextRotator.tsx` (replaces `src/index.js`)
- Test: `tests/basic.test.tsx` (replaces `tests/basic.js`)

**Interfaces:**
- Consumes: `useRotator` from `src/useRotator.ts`, `RotatorItem` & `TextRotatorProps` from `src/types.ts`
- Produces: Main `TextRotator` React component & barrel exports in `src/index.ts`

- [ ] **Step 1: Convert transitions.ts to TypeScript**

Convert CSS transition map generator to TypeScript with strict type annotations.

- [ ] **Step 2: Write failing unit tests for rich content rendering**

Create `tests/basic.test.tsx` testing:
1. Plain string content array.
2. `RotatorItem` with `text` and `link`.
3. `RotatorItem` with ReactNode `children` (e.g. `<span>Rich <b>content</b></span>`).
4. `RotatorItem` with custom `render` function `(item, idx) => <custom-tag />`.

- [ ] **Step 3: Run test to verify failure**

Run: `npx jest tests/basic.test.tsx`
Expected: FAIL

- [ ] **Step 4: Implement TextRotator.tsx & src/index.ts**

Implement `TextRotator` with:
- Normalization of `content` items (strings -> `RotatorItem`).
- Support for `render` prop function, `children` ReactNode, `link` anchor, and `text`.
- Barrel exports of `TextRotator`, `useRotator`, and types in `src/index.ts`.

- [ ] **Step 5: Run tests to verify all pass**

Run: `npm test`
Expected: PASS (all unit tests passing)

- [ ] **Step 6: Commit TextRotator component & barrel export**

```bash
git add src/transitions.ts src/TextRotator.tsx src/index.ts tests/basic.test.tsx
git commit -m "feat: implement TextRotator component with rich content support and TypeScript exports"
```

---

### Task 5: Demo Application Upgrade & Verification

**Files:**
- Modify: `demo/package.json`
- Modify: `demo/src/App.js` or `demo/src/index.js`

**Interfaces:**
- Consumes: Built library package from `dist/`
- Produces: Working React 19 demo application demonstrating text rotation, links, and custom JSX children.

- [ ] **Step 1: Build library package**

Run: `npm run build`
Expected: `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts` generated successfully.

- [ ] **Step 2: Update demo dependencies and code**

Update `demo/package.json` to React 18/19 and link to root package or local dist. Update `demo/src/App.js` to demonstrate simple text, links, and rich JSX rotation.

- [ ] **Step 3: Test demo build**

Run: `cd demo && npm install && npm run build`
Expected: Demo builds cleanly without errors.

- [ ] **Step 4: Commit demo updates**

```bash
git add demo/
git commit -m "chore: update demo app for React 19 and react-text-rotator v2.0.0 features"
```

---

### Task 6: Final Quality Audit (`react-doctor`) & Branch Integration

**Files:**
- Repository root

**Interfaces:**
- Consumes: All source files and test suite
- Produces: 0 errors/warnings from `npm run doctor`, clean build, updated branch `docs/claude-md` pushed to PR #59.

- [ ] **Step 1: Run typecheck and linting**

Run: `npm run typecheck && npm run lint`
Expected: Clean output with 0 errors.

- [ ] **Step 2: Run react-doctor audit**

Run: `npm run doctor`
Expected: Quality check completes with clean report for React 19 standards.

- [ ] **Step 3: Run full test suite**

Run: `npm test`
Expected: All tests pass cleanly.

- [ ] **Step 4: Push changes to docs/claude-md branch and update PR #59**

```bash
git push origin master:docs/claude-md --force-with-lease
```

- [ ] **Step 5: Final commit / verification summary**

Summarize all changes and confirm PR #59 is updated.
