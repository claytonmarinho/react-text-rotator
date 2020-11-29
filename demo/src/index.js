import React from "react";
import { render } from "react-dom";
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
    animation: "fade",
  },
  {
    text: "We shall fight in the fields and in the streets.",
    className: "classC",
    animation: "fade",
  },
  {
    text: "We shall fight in the hills.",
    className: "classD",
    animation: "fade",
  },
  {
    text: "We shall never surrender...",
    className: "classE",
    animation: "fade",
  },
];

const Demo = () => (
  <div className="wrapper">
    <h1>React Text Rotator1</h1>
    <div>
      <ReactTextRotator content={content} time={5000} startDelay={2000} />
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
  </div>
);

render(<Demo />, document.querySelector("#demo"));
