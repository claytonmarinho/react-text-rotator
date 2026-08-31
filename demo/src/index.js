import React from "react";
import { createRoot } from "react-dom/client";
import ReactTextRotator from "react-text-rotator";
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

const richContent = [
  {
    children: (
      <span>
        Rich content with <b>bold</b> and <i>italic</i> text.
      </span>
    ),
    className: "classA",
    animation: "fade",
  },
  {
    render: (item, index) => (
      <span>
        Item {index + 1} rendered via the <code>render</code> callback.
      </span>
    ),
    className: "classC",
    animation: "zoom",
  },
  {
    text: "Plain linked text still works.",
    className: "classE",
    animation: "squeeze",
    link: "https://github.com/claytonmarinho/react-text-rotator",
  },
];

const App = () => {
  return (
    <div className="wrapper">
      <h1>React Text Rotator</h1>
      <div className="example">
        <ReactTextRotator content={content} time={5000} startDelay={500} />
      </div>
      <div className="example">
        <h2>Rich content</h2>
        <ReactTextRotator content={richContent} time={4000} startDelay={500} />
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

createRoot(document.querySelector("#demo")).render(<App />);
