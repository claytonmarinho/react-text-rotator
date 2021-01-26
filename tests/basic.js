import React from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import ReactTextRotator from "../src";

describe("basic tests", () => {
  it("renders the component and shows the first text", () => {
    const props = {
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

    const component = render(<ReactTextRotator {...props} />);

    expect(component).toContain(
      '<div class="test" style="transition:opacity 500ms ease-in;opacity:0">text a</div>'
    );
  });

  it("uses fade as default transition", () => {
    const props = {
      content: [
        {
          text: "text a",
          className: "test",
        },
      ],
      time: 5000,
      startDelay: 0,
    };

    const component = render(<ReactTextRotator {...props} />);

    expect(component).toContain(
      '<div class="test" style="transition:opacity 500ms ease-in;opacity:0">text a</div>'
    );
  });

  it("accepts only text as content prop", () => {
    const props = {
      content: [
        {
          text: "text a",
        },
      ],
      time: 5000,
      startDelay: 0,
    };

    const component = render(<ReactTextRotator {...props} />);

    expect(component).toContain(
      '<div class="" style="transition:opacity 500ms ease-in;opacity:0">text a</div>'
    );
  });

  it("do not render if content array is empty", () => {
    const props = {
      content: [],
      time: 5000,
      startDelay: 0,
    };

    const component = render(<ReactTextRotator {...props} />);

    expect(component).toContain("");
  });

  it("accepts hyperlinks as optional content item property", () => {
    const props = {
      content: [
        {
          text: "text a",
          link: "https://example.com"
        },
      ],
      time: 5000,
      startDelay: 0,
    };

    const component = render(<ReactTextRotator {...props} />);

    expect(component).toContain(
      '<div class="" style="transition:opacity 500ms ease-in;opacity:0"><a href="https://example.com">text a</a></div>'
    );
  });

});
