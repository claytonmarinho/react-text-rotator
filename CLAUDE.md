# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`react-text-rotator` is a small React component library that rotates through an array of text items with CSS transitions. It builds to a UMD bundle and is published to npm. The repo is split in two: the library at the root, and a standalone demo app under `demo/` that consumes the published package (not the local source).

## Commands

Run these from the repo root unless noted.

```bash
npm test                 # run Jest once (single test file: tests/basic.js)
npm run test:watch       # Jest in watch mode
npm run test:coverage    # Jest with coverage report in coverage/
npm run build            # webpack build -> emits UMD bundle to lib/index.js
```

There is no `lint` script, but ESLint is configured in `.eslintrc.js`; run it with `npx eslint src tests`.

To run a single test: `npx jest tests/basic.js` or `npm test -- -t "test name"`.

Demo app (separate package, has its own `package.json` and `node_modules`):

```bash
cd demo && npm install
cd demo && npm start        # webpack-dev-server at http://localhost:3000
cd demo && npm run build    # build demo to demo/dist
cd demo && npm run deploy   # build + publish demo/dist to gh-pages
```

## Architecture

Source lives entirely in `src/` (three files):

- `src/index.js` — the default-exported `TextRotator` component. It composes `useRotator` with `react-transition-group`'s `<Transition>`. For the current item it merges two style objects — `styles[<animation>-default]` (base) and `styles[<animation>-<state>]` (the Transition state: entering/entered/exiting/exited) — and renders a `<div key={indexRef}>` wrapping either a `<a href>` (when the item has `link`) or plain text.
- `src/useRotator.js` — the custom hook that owns the rotation state. It keeps the current index in a mutable `indexRef` (a `useRef`), and `isEntered` as React state. Timing: a `setTimeout` fires the first item after `startDelay`, then a `setInterval` at `time + transitionTime * 2` advances items; a per-item `displayTimeout` flips `isEntered` and increments `indexRef` after `time`.
- `src/transitions.js` — a factory `transitions({ duration })` returning a flat map of CSS style objects keyed as `"<animation>-<state>"` for the three supported animations: `fade`, `zoom`, and `squeeze`.

Key relationships worth knowing:

- The `key={indexRef}` on the rendered `<div>` forces React to remount the node each time the index changes, which is what re-triggers the `<Transition>` enter/exit cycle.
- `react-transition-group` is the only declared `peerDependency` (v4.x). `react`, `react-dom`, and `prop-types` are imported but only listed as webpack `externals`, not as peer deps — add them if you change the public API surface.
- The build (`webpack.config.js`) externals `react`, `react-dom`, `react-transition-group`, and `prop-types`, targets `node`, and outputs UMD to `lib/index.js` (the package's `main`).
- Tests (`tests/basic.js`) render with `react-dom/server`'s `renderToStaticMarkup` and assert on the generated HTML string — no DOM/jsdom is used. Jest transforms JS via `jest.transform.js` (babel-jest with `@babel/env` + `@babel/preset-react`).
- Prop defaults (`time: 2500`, `startDelay: 250`, `transitionTime: 500`) are defined via `TextRotator.defaultProps` in `src/index.js` and mirrored in the README's Props table.
