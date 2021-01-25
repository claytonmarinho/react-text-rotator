# React-text-rotator

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Simple React component for rotating text.

[build-badge]: https://img.shields.io/travis/claytonmarinho/react-text-rotator/master.png?style=flat-square
[build]: https://travis-ci.org/claytonmarinho/react-text-rotator
[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package
[coveralls-badge]: https://img.shields.io/coveralls/claytonmarinho/react-text-rotator/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/claytonmarinho/react-text-rotator

[See the demo](https://claytonmarinho.github.io/react-text-rotator/) | [Try on Codepen](https://codepen.io/claytonmarinho/pen/gOwLgNR)

## Getting Start

```bash
npm install react-text-rotator --save
```

## Usage

```javascript
import React from "react";
import ReactTextRotator from "react-text-rotator";

const content = [
  {
    text: "We shall fight on the beaches.",
    className: "classA",
    animation: "fade",
  },
  {
    text: "We shall fight on the landing grounds.",
    className: "classB",
    animation: "zoom",
    link: "https://example.com/",
  },
  {
    text: "We shall fight in the fields and in the streets.",
    className: "classC",
    animation: "fade",
  },
  {
    text: "We shall fight in the hills.",
    className: "classD",
    animation: "squeeze",
  },
  {
    text: "We shall never surrender...",
    className: "classE",
    animation: "zoom",
    link: "https://google.com/",
  },
];

const MyComponent = () => (
  <div>
    <h1>Churchill Speech</h1>
    <ReactTextRotator content={content} time={5000} startDelay={2000} />
  </div>
);
```

## Props

| Name           | Type   | Required | Default | Obs                                          |
| -------------- | ------ | -------- | ------- | -------------------------------------------- |
| content        | Array  | True     |         | Array of content shape (see bellow)          |
| time           | Number | False    | 2500    | Time in milliseconds                         |
| startDelay     | Number | False    | 250     | Wait before the first content (milliseconds) |
| transitionTime | Number | False    | 500     | Time in milliseconds                         |

Content shape

| Name      | Type   | Required | Default | Obs                         |
| --------- | ------ | -------- | ------- | --------------------------- |
| text      | String | True     |         | Text to be shown            |
| className | String | False    |         | Class name for each span    |
| animation | String | False    | 'fade'  | 'fade', 'zoom' or 'squeeze' |
| link      | String | False    |         | Optional hyperlink for text |

## Development

### Installation

- Clone `git clone https://github.com/claytonmarinho/react-text-rotator.git`.

- Running `npm install` in the components's root directory will install everything you need for development.

### Demo Development Server

- `npm start` will run a development server with the component's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading.

### Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `npm run test:watch` will run the tests on every change.

### Building

- `npm run build` will build the component for publishing to npm and also bundle the demo app.

- `npm run clean` will delete built resources.
