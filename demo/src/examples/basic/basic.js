import React from "react";
import ReactTextRotator from "../../../../src";
import "./basic.css";

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

const BasicExample = () => (
  <ReactTextRotator content={content} time={5000} startDelay={2000} />
);

export default BasicExample;
