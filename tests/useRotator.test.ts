import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import useRotator from "../src/useRotator";

// Hoisted to a stable reference: the hook re-runs its setup effect when the
// `content` array identity changes, so an inline literal would reset state on
// every re-render (the pre-existing content-identity fragility, kept by design).
const content = ["Hello", "World"];

describe("useRotator", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("has initial state currentIndex 0 and isEntered false", () => {
    const { result } = renderHook(() =>
      useRotator({ content, startDelay: 100 })
    );

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isEntered).toBe(false);
    expect(result.current.currentItem).toBe("Hello");
  });

  it("enters after startDelay and stays at index 0", () => {
    const { result } = renderHook(() =>
      useRotator({ content, startDelay: 100, time: 2500 })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isEntered).toBe(true);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentItem).toBe("Hello");
  });

  it("exits after time while currentIndex stays at 0", () => {
    const { result } = renderHook(() =>
      useRotator({ content, startDelay: 100, time: 2500 })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.isEntered).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(result.current.isEntered).toBe(false);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentItem).toBe("Hello");
  });

  it("next() advances the index, wraps around, and sets isEntered true", () => {
    const { result } = renderHook(() =>
      useRotator({ content, startDelay: 100, time: 2500 })
    );

    act(() => {
      result.current.next();
    });
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentItem).toBe("World");
    expect(result.current.isEntered).toBe(true);

    act(() => {
      result.current.next();
    });
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentItem).toBe("Hello");
    expect(result.current.isEntered).toBe(true);
  });

  it("clears all timers on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { unmount } = renderHook(() =>
      useRotator({ content, startDelay: 100, time: 2500 })
    );

    // Advance past startDelay so the display (exit) timer is armed.
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(jest.getTimerCount()).toBe(1);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);

    clearTimeoutSpy.mockRestore();
  });
});
