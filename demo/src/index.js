import "@babel/polyfill";

import React, { useState, Suspense } from "react";
import ReactDOM from "react-dom";
import "./style.css";

const BasicExample = React.lazy(() => import("./examples/basic"));

const App = () => {
  const [example, setExample] = useState("basic");

  return (
    <div className="wrapper">
      <h1>React Text Rotator</h1>
      <form onChange={(e) => setExample(e.target.value)}>
        <input
          type="radio"
          id="basic"
          name="example"
          value="basic"
          defaultChecked={example === "basic"}
        />
        <label htmlFor="basic">basic</label>

        {/* <input
          type="radio"
          id="async"
          name="example"
          value="advanced"
          defaultChecked={example === "advanced"}
        />
        <label htmlFor="advanced">advanced</label> */}
      </form>
      <div className="example">
        <Suspense fallback={<div>Loading...</div>}>
          {example === "basic" && <BasicExample />}
        </Suspense>
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
};

ReactDOM.render(<App />, document.querySelector("#demo"));
