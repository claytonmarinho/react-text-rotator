# v2.0.0 Major Redesign Implementation Plan (corrected)

> **For agentic workers:** implement this plan task-by-task, TDD where the task says so. This corrected plan is the operative authority. It supersedes the earlier spec's §6.3 and the old Task 2: PR #59 is already merged, and the GitHub templates + `CLAUDE.md` already exist on `master`.

**Goal:** v2.0.0 of `react-text-rotator`: TypeScript rewrite, `tsup` build (CJS + ESM + `.d.ts`), React 18/19 support, rich content rendering (`children`/`render`/`link`/`target`), a timer-safe `useRotator` (fixes issues #58 memory leak and #50 timer desync), and unified AI-agent instructions (`AGENTS.md`).

**Tech Stack:** React 18/19, TypeScript 5, tsup, Jest (ts-jest), @testing-library/react + jsdom, react-transition-group v4, react-doctor, ESLint.

## Global Constraints (binding — use these exact values)

- Peer dependencies: `"react": "^18.0.0 || ^19.0.0"`, `"react-dom": "^18.0.0 || ^19.0.0"`, `"react-transition-group": "^4.4.0"`.
- Build output in `dist/`: `index.js` (CommonJS), `index.mjs` (ESM), `index.d.ts` (types).
- Prop defaults: `time: 2500`, `startDelay: 250`, `transitionTime: 500`.
- **Timer model (3-phase, no `setInterval`):** `currentIndex` is React state. The index advances ONLY after the exit transition completes (via `react-transition-group`'s `onExited` → `next`), with modulo wrap. The exiting frame shows the outgoing item (not the next). All timer IDs live in `useRef`s; a single `clearAllTimers()` runs in effect cleanup with explicit `if` checks — **no `&&` short-circuit**.
- **Rich-content render precedence (highest first):** `render(item, index)` → `children` → `link` (wraps `text` in `<a>` with `target`) → `text`.
- **Hook public API (YAGNI):** `useRotator` returns `{ isEntered, currentIndex, currentItem, next }`. No `prev`/`goTo`.
- **Demo** consumes the library via `file:..` (local dist), on React 18/19.
- **Out of scope (deferred):** `visibilitychange` pause.
- **Delete `docs/superpowers/`** (spec + plan) in the final task.

---

### Task 1: Package Infrastructure & Tooling (tsup + TypeScript + Jest + ESLint)

**Files:**
- Modify: `package.json`, `jest.config.js`, `.eslintrc.js`, `.gitignore`
- Create: `tsconfig.json`, `tsup.config.ts`
- Delete: `webpack.config.js`, `jest.transform.js`

- [ ] **Step 1: Rewrite `package.json`.** Set `"version": "2.0.0"`, `"main": "dist/index.js"`, `"module": "dist/index.mjs"`, `"types": "dist/index.d.ts"`, `"files": ["dist"]`, `"sideEffects": false`. Add an `exports` map:
  ```json
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  }
  ```
  Replace scripts with:
  ```json
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "doctor": "npx react-doctor@latest",
    "lint": "eslint src tests",
    "typecheck": "tsc --noEmit"
  }
  ```
  Set `peerDependencies` to the exact ranges in Global Constraints. Remove `prop-types`. Replace devDependencies with: `typescript`, `tsup`, `@types/react`, `@types/react-dom`, `ts-jest`, `jest`, `@testing-library/react`, `@testing-library/dom`, `jsdom`, `react-doctor`, `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`. Remove `@babel/*`, `babel-jest`, `babel-loader`, `webpack`, `webpack-cli`. Keep `react`/`react-dom` out of dependencies (they are peer deps + used only via `npm install` in demo).

- [ ] **Step 2: Create `tsconfig.json`:**
  ```json
  {
    "compilerOptions": {
      "target": "ES2018",
      "module": "ESNext",
      "moduleResolution": "node",
      "lib": ["ES2019", "DOM"],
      "jsx": "react-jsx",
      "strict": true,
      "declaration": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "outDir": "dist"
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist", "lib", "demo", "tests"]
  }
  ```

- [ ] **Step 3: Create `tsup.config.ts`:**
  ```ts
  import { defineConfig } from "tsup";

  export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    target: "es2018",
    outDir: "dist",
    external: ["react", "react-dom", "react-transition-group"],
  });
  ```

- [ ] **Step 4: Rewrite `jest.config.js` for ts-jest + jsdom:**
  ```js
  module.exports = {
    clearMocks: true,
    coverageDirectory: "coverage",
    testEnvironment: "jsdom",
    testMatch: ["**/tests/**/*.test.[jt]s?(x)"],
    testPathIgnorePatterns: ["/node_modules/"],
    transform: {
      "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
    },
  };
  ```
  Delete `jest.transform.js`.

- [ ] **Step 5: Rewrite `.eslintrc.js` for TypeScript:**
  ```js
  module.exports = {
    root: true,
    env: { browser: true, es2021: true, node: true, jest: true },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
    },
    settings: { react: { version: "detect" } },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:@typescript-eslint/recommended",
    ],
    plugins: ["react", "react-hooks", "@typescript-eslint"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
    ignorePatterns: ["lib", "dist", "demo", "coverage", "node_modules"],
  };
  ```

- [ ] **Step 6: Add `/dist` to `.gitignore`** (alongside the existing `/coverage`, `/lib`, `/node_modules`).

- [ ] **Step 7: Install and verify tooling.** Run `npm install`. Then `npm run typecheck` (no `.ts` files yet — should pass trivially) and `npm run build` (tsup will fail until `src/index.ts` exists — expected; do NOT create it in this task).

- [ ] **Step 8: Commit.** `git add package.json package-lock.json tsconfig.json tsup.config.ts jest.config.js .eslintrc.js .gitignore` and remove `webpack.config.js` `jest.transform.js`. Commit: `chore: setup tsup, typescript, and jest tooling for v2.0.0`.

---

### Task 2: TypeScript Types + Timer-Safe `useRotator` Hook (TDD)

**Files:**
- Create: `src/types.ts`, `src/useRotator.ts`
- Create test: `tests/useRotator.test.ts`

**Interfaces:** `useRotator` consumes `UseRotatorOptions` and returns `UseRotatorReturn` (both from `src/types.ts`).

- [ ] **Step 1: Create `src/types.ts`** with exactly these interfaces (import types from `react`):
  ```ts
  import type { CSSProperties, ReactNode } from "react";

  export interface RotatorItem {
    text?: string;
    children?: ReactNode;
    link?: string;
    target?: string;
    className?: string;
    style?: CSSProperties;
    animation?: string;
    render?: (item: RotatorItem, index: number) => ReactNode;
  }

  export interface TextRotatorProps {
    content: Array<string | RotatorItem>;
    time?: number;
    startDelay?: number;
    transitionTime?: number;
    className?: string;
    style?: CSSProperties;
    autoPlay?: boolean;
    onItemChange?: (item: RotatorItem | string, index: number) => void;
  }

  export interface UseRotatorOptions {
    content: Array<string | RotatorItem>;
    time?: number;
    startDelay?: number;
    autoPlay?: boolean;
    onItemChange?: (item: RotatorItem | string, index: number) => void;
  }

  export interface UseRotatorReturn {
    isEntered: boolean;
    currentIndex: number;
    currentItem: RotatorItem | string | undefined;
    next: () => void;
  }
  ```
  Note: `transitionTime` is intentionally NOT in `UseRotatorOptions` — exit timing is the component's concern (the `<Transition>` `timeout`).

- [ ] **Step 2: Write the failing hook test `tests/useRotator.test.ts`.** Use `@testing-library/react`'s `renderHook` + `jest.useFakeTimers()`. Cover: (a) initial state `{ currentIndex: 0, isEntered: false }`; (b) after `startDelay` the hook enters (`isEntered === true`) and stays at index 0; (c) after `time` it exits (`isEntered === false`) while `currentIndex` is still 0; (d) `next()` advances `currentIndex` to 1, wraps back to 0 past the last index, and sets `isEntered === true`; (e) unmount clears timers — spy on `clearTimeout` and assert all active timers are cleared (or, at minimum, that unmounting produces no "state update on unmounted component" warnings). Run `npx jest tests/useRotator.test.ts` and confirm it FAILS (no `src/useRotator.ts` yet).

- [ ] **Step 3: Implement `src/useRotator.ts`** (transcribe this — it is correct; do not "simplify" the timer model):
  ```ts
  import { useCallback, useEffect, useRef, useState } from "react";
  import type { UseRotatorOptions, UseRotatorReturn } from "./types";

  export default function useRotator({
    content,
    time = 2500,
    startDelay = 250,
    autoPlay = true,
    onItemChange,
  }: UseRotatorOptions): UseRotatorReturn {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isEntered, setIsEntered] = useState(false);

    const indexRef = useRef(0);
    const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearAllTimers = useCallback(() => {
      if (startTimerRef.current) {
        clearTimeout(startTimerRef.current);
        startTimerRef.current = null;
      }
      if (displayTimerRef.current) {
        clearTimeout(displayTimerRef.current);
        displayTimerRef.current = null;
      }
    }, []);

    const scheduleExit = useCallback(() => {
      if (displayTimerRef.current) {
        clearTimeout(displayTimerRef.current);
      }
      displayTimerRef.current = setTimeout(() => {
        setIsEntered(false);
      }, time);
    }, [time]);

    const enterCurrent = useCallback(() => {
      setIsEntered(true);
      scheduleExit();
    }, [scheduleExit]);

    const next = useCallback(() => {
      if (content.length === 0) {
        return;
      }
      const nextIndex = (indexRef.current + 1) % content.length;
      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      enterCurrent();
    }, [content.length, enterCurrent]);

    useEffect(() => {
      clearAllTimers();
      indexRef.current = 0;
      setCurrentIndex(0);
      setIsEntered(false);

      if (!autoPlay || content.length === 0) {
        return;
      }

      startTimerRef.current = setTimeout(() => {
        enterCurrent();
      }, startDelay);

      return clearAllTimers;
    }, [content, autoPlay, startDelay, enterCurrent, clearAllTimers]);

    useEffect(() => {
      if (onItemChange && content.length > 0) {
        onItemChange(content[currentIndex], currentIndex);
      }
    }, [currentIndex, content, onItemChange]);

    return {
      isEntered,
      currentIndex,
      currentItem: content[currentIndex],
      next,
    };
  }
  ```
  The index advances only in `next()` (wired to `onExited` by the component in Task 3), so the exiting frame always shows the outgoing item — this is the #50 fix. The explicit `clearAllTimers` with no short-circuit is the #58 fix.

- [ ] **Step 4: Run `npx jest tests/useRotator.test.ts`** — confirm PASS.

- [ ] **Step 5: Commit.** `git add src/types.ts src/useRotator.ts tests/useRotator.test.ts`. Commit: `refactor: implement timer-safe useRotator hook in TypeScript`.

---

### Task 3: `TextRotator` Component + Transitions + Rich Content (TDD)

**Files:**
- Create: `src/transitions.ts`, `src/TextRotator.tsx`, `src/index.ts`
- Create test: `tests/basic.test.tsx`
- Delete: `src/index.js`, `src/useRotator.js`, `src/transitions.js`, `tests/basic.js`

- [ ] **Step 1: Delete the old JS sources** `src/index.js`, `src/useRotator.js`, `src/transitions.js`, and the old test `tests/basic.js`. (`tests/useRotator.test.ts` from Task 2 still imports `../src/useRotator` → `src/useRotator.ts`, which exists.)

- [ ] **Step 2: Write the failing test `tests/basic.test.tsx`.** Use `renderToStaticMarkup` from `react-dom/server` for static assertions (initial state = `isEntered false` → Transition state `exited`). Cover, asserting on the generated HTML string:
  1. Plain string array `content: ["text a", "text b"]` → contains `text a` inside a `<div class="" ...>`.
  2. `RotatorItem` `{ text: "text a", className: "test" }` → `<div class="test" style="transition:opacity 500ms ease-in;opacity:0">text a</div>`.
  3. `RotatorItem` `{ text: "text a", link: "https://example.com" }` → contains `<a href="https://example.com">text a</a>`.
  4. `RotatorItem` with `children` (`<span>Rich <b>content</b></span>`) → contains `<span>Rich <b>content</b></span>` (and no `<a>`).
  5. `RotatorItem` with `render` (`(item, idx) => <em>custom {idx}</em>`) → contains `<em>custom 0</em>`.
  6. `content: []` → renders `""` (null).
  Then, using `@testing-library/react`'s `render` + `screen` + `act` + `jest.useFakeTimers()`, add ONE rotation test: render `content=["a","b"]` with `time=1000`, `startDelay=0`, `transitionTime=100`; assert `screen.getByText("a")` is present; `act(() => jest.advanceTimersByTime(1000))` then `act(() => jest.advanceTimersByTime(100))` → `screen.getByText("b")`; another `1100ms` → back to `"a"` (wrap). Run `npx jest tests/basic.test.tsx` and confirm it FAILS (the barrel `src/index.ts` does not exist yet).

- [ ] **Step 3: Create `src/transitions.ts`** (typed; same key/values as the old `transitions.js`, `duration` is a number):
  ```ts
  import type { CSSProperties } from "react";

  export default ({ duration }: { duration: number }): Record<string, CSSProperties> => ({
    "fade-default": { transition: `opacity ${duration}ms ease-in`, opacity: 0 },
    "fade-entering": { opacity: 0 },
    "fade-entered": { opacity: 1 },
    "fade-exiting": { opacity: 0 },
    "fade-exited": { opacity: 0 },
    "zoom-default": { transition: `transform ${duration}ms ease-in`, transform: "scale(0)", opacity: 0 },
    "zoom-entering": { transform: "scale(0)", opacity: 0 },
    "zoom-entered": { transform: "scale(1)", opacity: 1 },
    "zoom-exiting": { transform: "scale(0)", opacity: 1 },
    "zoom-exited": { transform: "scale(0)", opacity: 0 },
    "squeeze-default": { transition: `transform ${duration}ms ease-in`, transform: "rotateY(90deg)", opacity: 0 },
    "squeeze-entering": { transform: "rotateY(90deg)", opacity: 0 },
    "squeeze-entered": { transform: "rotateY(0deg)", opacity: 1 },
    "squeeze-exiting": { transform: "rotateY(90deg)", opacity: 1 },
    "squeeze-exited": { transform: "rotateY(90deg)", opacity: 0 },
  });
  ```

- [ ] **Step 4: Create `src/TextRotator.tsx`** (transcribe this; note the automatic JSX runtime — no `import React` needed):
  ```tsx
  import Transition from "react-transition-group/Transition";
  import useRotator from "./useRotator";
  import transitions from "./transitions";
  import type { RotatorItem, TextRotatorProps } from "./types";

  const normalizeItem = (item: string | RotatorItem): RotatorItem =>
    typeof item === "string" ? { text: item } : item;

  const TextRotator = ({
    content,
    time = 2500,
    startDelay = 250,
    transitionTime = 500,
    className = "",
    style,
    autoPlay = true,
    onItemChange,
  }: TextRotatorProps) => {
    const styles = transitions({ duration: transitionTime });
    const { isEntered, currentIndex, currentItem, next } = useRotator({
      content,
      time,
      startDelay,
      autoPlay,
      onItemChange,
    });

    if (currentItem == null) {
      return null;
    }

    const item = normalizeItem(currentItem);
    const {
      text,
      children,
      link,
      target,
      className: itemClassName = "",
      style: itemStyle,
      animation = "fade",
      render,
    } = item;

    return (
      <Transition in={isEntered} timeout={transitionTime} onExited={next}>
        {(state) => {
          const mergedStyle = {
            ...styles[`${animation}-default`],
            ...styles[`${animation}-${state}`],
            ...style,
            ...itemStyle,
          };

          let inner;
          if (render) {
            inner = render(item, currentIndex);
          } else if (children !== undefined && children !== null) {
            inner = children;
          } else if (link) {
            inner = (
              <a href={link} target={target}>
                {text}
              </a>
            );
          } else {
            inner = text;
          }

          return (
            <div className={`${className} ${itemClassName}`.trim()} style={mergedStyle}>
              {inner}
            </div>
          );
        }}
      </Transition>
    );
  };

  export default TextRotator;
  ```
  Precedence: `render` → `children` → `link` → `text`. Style precedence (later wins): animation-default → animation-state → container `style` → item `style`.

- [ ] **Step 5: Create `src/index.ts`** (barrel):
  ```ts
  export { default } from "./TextRotator";
  export { default as TextRotator } from "./TextRotator";
  export { default as useRotator } from "./useRotator";
  export type { RotatorItem, TextRotatorProps, UseRotatorOptions, UseRotatorReturn } from "./types";
  ```

- [ ] **Step 6: Run `npm test`** — confirm all tests pass.

- [ ] **Step 7: Commit.** `git add src/ tests/` (with the deletions). Commit: `feat: TextRotator component with rich content support and TypeScript exports`.

---

### Task 4: `AGENTS.md` + Pointer Files + README Update

**Files:**
- Create: `AGENTS.md`, `OPENCODE.md`, `COPILOT.md`, `AGY.md`
- Rewrite: `CLAUDE.md` (to a pointer)
- Modify: `README.md` (Props table + TS usage + rich content)

- [ ] **Step 1: Create `AGENTS.md`** — the canonical instruction file. Move the current `CLAUDE.md` content into it, generalized for any agent: repo overview, the `npm run build` / `npm test` / `npm run doctor` / `npm run lint` / `npm run typecheck` commands, architecture (TypeScript `src/`, `tsup` → `dist/`, demo in `demo/` consuming local dist), the timer model, the render precedence, and the obligations ("run `npm run doctor` and `npm test` before declaring a task done", "no `any`", "support React 18 and 19").

- [ ] **Step 2: Create the pointer files** `CLAUDE.md`, `OPENCODE.md`, `COPILOT.md`, `AGY.md`, each:
  ```markdown
  # AI Agent Instructions

  See [AGENTS.md](./AGENTS.md) for full project instructions, developer commands, architecture, and coding standards.
  ```

- [ ] **Step 3: Update `README.md`.** Add TypeScript usage (`import TextRotator from "react-text-rotator"` unchanged; document `content: Array<string | RotatorItem>`), the new props in the Props table (`className`, `style`, `autoPlay`, `onItemChange`, and `RotatorItem` fields `children`, `render`, `target`, `style`), and note the `time`/`startDelay`/`transitionTime` defaults (2500 / 250 / 500).

- [ ] **Step 4: Commit.** Commit: `docs: add AGENTS.md canonical instructions, pointers, and v2 README`.

---

### Task 5: Demo App — Local Dist Link + Rich Content

**Files:**
- Modify: `demo/package.json`, `demo/src/index.js`

- [ ] **Step 1: Modify `demo/package.json`.** Change the dependency `"react-text-rotator": "^1.2.0"` to `"react-text-rotator": "file:.."`. Add `react` and `react-dom` (e.g. `"^18.2.0"`) to `dependencies`. Keep the existing webpack/babel devDeps (the demo keeps its own webpack build).

- [ ] **Step 2: Modify `demo/src/index.js`.** Switch `ReactDOM.render(...)` to `createRoot` (`import { createRoot } from "react-dom/client"` and `createRoot(document.querySelector("#demo")).render(<App />)`). Un-comment the local import: `import ReactTextRotator from "../../src";` (drop the `react-text-rotator` npm import). Add a second rotator demoing rich content: `content` items with `children` (`<span>…<b>…</b></span>`) and with `render`.

- [ ] **Step 3: Build the library first, then the demo.** From repo root run `npm run build` (produces `dist/`), then `cd demo && npm install && npm run build`. Confirm the demo builds cleanly.

- [ ] **Step 4: Commit.** Commit: `chore: point demo at local dist and demo rich content`.

---

### Task 6: Final Quality Audit + Cleanup

**Files:** repository root (and delete `docs/superpowers/`)

- [ ] **Step 1: Typecheck + lint.** Run `npm run typecheck && npm run lint`. Fix any errors (0 errors required). If a fix is needed, it must be small and committed separately.

- [ ] **Step 2: react-doctor audit.** Run `npm run doctor`. Resolve any Critical errors it reports for `src/` (0 Critical).

- [ ] **Step 3: Full test suite + coverage.** Run `npm test` and `npm run test:coverage`. All tests pass.

- [ ] **Step 4: Build.** Run `npm run build`. Confirm `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts` exist.

- [ ] **Step 5: Delete the superpowers artifacts.** `git rm -r docs/superpowers` (removes both the spec and this plan). Commit: `chore: remove superpowers spec/plan artifacts`.

- [ ] **Step 6: Final verification summary.** Confirm `git status` is clean, all tests pass, and the branch diff is the v2.0.0 change set.
