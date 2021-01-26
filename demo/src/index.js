import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";
import ReactTextRotator from "../../src";
import "./style.css";

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

const App = () => {
  return (
    <div className="wrapper">
      <h1>React Text Rotator</h1>
      <div className="example">
        <ReactTextRotator content={content} time={5000} startDelay={500} />
      </div>
      <div className="github-buttons">
        <iframe
          src="https://ghbtns.com/github-btn.html?user=claytonmarinho&repo=react-text-rotator&type=star&count=true&size=large"
          frameBorder="0"
          scrolling="0"
          width="160px"
          height="30px"
        ></iframe>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=claytonmarinho&repo=react-text-rotator&type=fork&count=true&size=large"
          frameBorder="0"
          scrolling="0"
          width="160px"
          height="30px"
        ></iframe>
      </div>
      <div className="code-pen">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://codepen.io/claytonmarinho/pen/gOwLgNR"
        >
          Try on CodePen
        </a>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#demo"));
