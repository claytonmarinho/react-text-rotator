import React from "react";
import { renderToStaticMarkup as render } from "react-dom/server";

import ReactTextRtorator from "../src";

describe("Component", () => {
  let props;

  beforeEach(() => {
    props = {
      content: [
        {
          text: "text a",
          className: "test",
          animation: "fade",
        },
      ],
      time: 5000,
      startDelay: 0,
    };
  });

  it("render component", () => {
    expect(render(<ReactTextRtorator {...props} />)).toContain(
      '<span class="test" style="transition:opacity 500ms ease-in;opacity:0">text a</span>'
    );
  });
});
