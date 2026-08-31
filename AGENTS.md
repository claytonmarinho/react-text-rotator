# AGENTS.md

This file provides canonical guidance to AI coding agents working in this repository.

## What this is

`react-text-rotator` is a small React component library that rotates through an array of text items with CSS transitions. It is written in TypeScript, built with tsup to `dist/` (CommonJS + ESM + type declarations), and published to npm. The repo is split in two: the library at the root, and a standalone demo app under `demo/`.

The component takes `content: Array<string | RotatorItem>`. String items are treated as `{ text: item }`. Rich content is rendered through a precedence chain: `render` → `children` → `link` (wraps `text` in an `<a>`) → `text`.

## Developer commands

Run these from the repo root unless noted.

```bash
npm run build          # tsup -> dist/index.js (CJS), dist/index.mjs (ESM), dist/index.d.ts (types)
npm run dev            # tsup in watch mode
npm test               # run Jest once (tests/useRotator.test.ts + tests/basic.test.tsx)
npm run test:watch     # Jest in watch mode
npm run test:coverage  # Jest with coverage report in coverage/
npm run doctor         # npx react-doctor@latest — audit React usage/compatibility
npm run lint           # ESLint over src and tests
npm run typecheck      # tsc --noEmit (strict)
```

To run a single test: `npx jest tests/useRotator.test.ts` or `npm test -- -t "test name"`.

Peer dependencies (the package does not bundle React): `react` and `react-dom` `^18.0.0 || ^19.0.0`, and `react-transition-group` `^4.4.0`.

Demo app (separate package with its own `package.json` and `node_modules`; it consumes the local `dist/` build via a `file:..` link):

```bash
cd demo && npm install
cd demo && npm start        # webpack-dev-server at http://localhost:3000
cd demo && npm run build    # build demo to demo/dist
cd demo && npm run deploy   # build + publish demo/dist to gh-pages
```

## Architecture

Source lives in `src/` (five TypeScript files):

- `src/index.ts` — barrel entry (also the tsup entry). Default- and named-exports `TextRotator`, exports `useRotator`, and re-exports the public types (`RotatorItem`, `TextRotatorProps`, `UseRotatorOptions`, `UseRotatorReturn`).
- `src/TextRotator.tsx` — the default-exported `TextRotator` component. Composes `useRotator` with `react-transition-group`'s `<Transition>`: `<Transition in={isEntered} timeout={transitionTime} onExited={next} nodeRef={nodeRef}>`. It normalizes string items (`typeof item === "string" ? { text: item } : item`), merges style objects, and renders a `<div ref={nodeRef}>`. The `nodeRef` is required — react-transition-group v4 otherwise calls `ReactDOM.findDOMNode`, which React 19 removed.
- `src/useRotator.ts` — the custom hook that owns rotation state. Returns `{ isEntered, currentIndex, currentItem, next }`.
- `src/transitions.ts` — a factory `transitions({ duration })` returning a flat map of CSS style objects keyed `"<animation>-<state>"` for the three supported animations: `fade`, `zoom`, and `squeeze`.
- `src/types.ts` — `RotatorItem`, `TextRotatorProps`, `UseRotatorOptions`, `UseRotatorReturn`.

Tests live in `tests/`:

- `tests/useRotator.test.ts` — hook unit tests with `jest.useFakeTimers()` (initial state, enter/exit timing, `next()` wrap, unmount clears timers).
- `tests/basic.test.tsx` — component tests. Static assertions use `react-dom/server`'s `renderToStaticMarkup` (via the `react-dom/server.node` subpath — React 19's browser build references `MessageChannel` at module load, which jsdom lacks). Rotation is asserted with `@testing-library/react` `render` + `act` + fake timers.

### Timer model (3-phase, no `setInterval`)

Rotation state is `currentIndex` (React state) with `indexRef` as a mutable mirror. `isEntered` is separate React state that drives the `<Transition>`.

1. **Enter** — after `startDelay`, a `startTimerRef` `setTimeout` fires `enterCurrent()` (`setIsEntered(true)` + `scheduleExit()`).
2. **Exit** — `scheduleExit` arms `displayTimerRef` to set `isEntered = false` after `time`. The `<Transition>` then runs its exit transition for `transitionTime` (its `timeout`).
3. **Advance** — only when the exit transition completes does `<Transition>`'s `onExited` call `next()`, which advances `indexRef`/`currentIndex` modulo `content.length`, wraps around, and calls `enterCurrent()` again.

Because the index advances only in `next()` (wired to `onExited`), the exiting frame always shows the outgoing item — this is the timer-desync fix. All timer IDs live in `useRef`s; a single `clearAllTimers()` runs on the setup-effect cleanup and on every reset, with explicit `if (ref.current)` checks — no `&&` short-circuit — which is the memory-leak fix. When `autoPlay` is `false`, no timers are scheduled and the first item renders statically (never advances). When `content` is empty, the component renders `null`.

### Render precedence (highest first)

For each item: `render(item, index)` → `children` → `link` (wraps `text` in `<a href={link} target={target}>`) → `text`.

### Style precedence (later wins)

`animation-<state>` merged over `animation-default`, then the component `style` prop, then the per-item `style`.

### Prop defaults

`time: 2500`, `startDelay: 250`, `transitionTime: 500`, `className: ""`, `autoPlay: true`. Per-item `animation` defaults to `"fade"`.

## Agent obligations

- Run `npm run doctor` and `npm test` before declaring a task done. When a task touches TS or lint surface, also run `npm run typecheck` and `npm run lint` (0 errors).
- No `any` types — the codebase compiles under `strict`; type the public API explicitly.
- Support React 18 and React 19 (peer range `^18.0.0 || ^19.0.0`). Do not use APIs removed in React 19 (e.g. `ReactDOM.findDOMNode`).
