import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
// React 19's `react-dom/server` (browser build) references `MessageChannel` at
// module load; jsdom does not implement it, so the import throws. The node
// subpath exports the same `renderToStaticMarkup` with identical output.
import { renderToStaticMarkup } from "react-dom/server.node";
import TextRotator from "../src";
import type { RotatorItem } from "../src";

// Content arrays are hoisted to stable module-level references: the hook's
// setup effect depends on the `content` array identity, so an inline literal
// re-created on every render would reset the rotation (see task-2 report).
const stringContent = ["text a", "text b"];
const classItemContent: RotatorItem[] = [{ text: "text a", className: "test" }];
const linkItemContent: RotatorItem[] = [{ text: "text a", link: "https://example.com" }];
const childrenItemContent: RotatorItem[] = [{ children: <span>Rich <b>content</b></span> }];
const renderItemContent: RotatorItem[] = [
  { text: "text a", render: (item, idx) => <em>custom {idx}</em> },
];
const emptyContent: Array<string | RotatorItem> = [];
const rotationContent = ["a", "b"];

describe("TextRotator", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("static rendering", () => {
    it("renders plain string items inside a div", () => {
      const html = renderToStaticMarkup(<TextRotator content={stringContent} />);

      expect(html).toContain(
        '<div class="" style="transition:opacity 500ms ease-in;opacity:0">text a</div>'
      );
    });

    it("applies RotatorItem className and fade animation styles", () => {
      const html = renderToStaticMarkup(<TextRotator content={classItemContent} />);

      expect(html).toContain(
        '<div class="test" style="transition:opacity 500ms ease-in;opacity:0">text a</div>'
      );
    });

    it("wraps items with a link in an anchor tag", () => {
      const html = renderToStaticMarkup(<TextRotator content={linkItemContent} />);

      expect(html).toContain('<a href="https://example.com">text a</a>');
    });

    it("renders children as rich content without an anchor wrapper", () => {
      const html = renderToStaticMarkup(<TextRotator content={childrenItemContent} />);

      expect(html).toContain('<span>Rich <b>content</b></span>');
      expect(html).not.toContain("<a");
    });

    it("renders through the custom render function with the item index", () => {
      const html = renderToStaticMarkup(<TextRotator content={renderItemContent} />);

      expect(html).toContain("<em>custom 0</em>");
    });

    it("renders nothing when content is empty", () => {
      const html = renderToStaticMarkup(<TextRotator content={emptyContent} />);

      expect(html).toBe("");
    });
  });

  describe("rotation", () => {
    it("advances through items and wraps around", () => {
      render(
        <TextRotator content={rotationContent} time={1000} startDelay={0} transitionTime={100} />
      );

      expect(screen.getByText("a")).toBeTruthy();

      // Each advance is its own `act` so the intermediate enter/exit state
      // commits (React batches everything inside a single `act`, which would
      // swallow the enter and never advance the item). Rotation is driven by
      // react-transition-group's `onExited`; the `<Transition>` receives a
      // `nodeRef` because React 19 removed `ReactDOM.findDOMNode`, which
      // react-transition-group v4 otherwise calls during a transition.
      act(() => {
        jest.advanceTimersByTime(0);
      });
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(screen.getByText("b")).toBeTruthy();

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(screen.getByText("a")).toBeTruthy();
    });
  });
});
