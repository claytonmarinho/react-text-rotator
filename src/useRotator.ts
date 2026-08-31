import { useCallback, useEffect, useRef, useState } from "react";
import type { UseRotatorOptions, UseRotatorReturn } from "./types";

export default function useRotator({
  content,
  time = 2500,
  startDelay = 250,
  autoPlay = true,
  onItemChange,
}: UseRotatorOptions): UseRotatorReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEntered, setIsEntered] = useState(false);

  const indexRef = useRef(0);
  const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDisplayTimer = useCallback(() => {
    if (displayTimerRef.current) {
      clearTimeout(displayTimerRef.current);
      displayTimerRef.current = null;
    }
  }, []);

  const scheduleExit = useCallback(() => {
    clearDisplayTimer();
    displayTimerRef.current = setTimeout(() => {
      setIsEntered(false);
    }, time);
  }, [time, clearDisplayTimer]);

  const enterCurrent = useCallback(() => {
    setIsEntered(true);
    scheduleExit();
  }, [scheduleExit]);

  const next = useCallback(() => {
    if (content.length === 0) {
      return;
    }
    const nextIndex = (indexRef.current + 1) % content.length;
    indexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
    enterCurrent();
  }, [content.length, enterCurrent]);

  useEffect(() => {
    clearDisplayTimer();
    indexRef.current = 0;
    setCurrentIndex(0);
    setIsEntered(false);

    let startTimer: ReturnType<typeof setTimeout> | null = null;

    if (autoPlay && content.length > 0) {
      startTimer = setTimeout(() => {
        enterCurrent();
      }, startDelay);
    }

    return () => {
      if (startTimer) {
        clearTimeout(startTimer);
      }
      clearDisplayTimer();
    };
  }, [content, autoPlay, startDelay, enterCurrent, clearDisplayTimer]);

  useEffect(() => {
    if (onItemChange && currentIndex < content.length) {
      onItemChange(content[currentIndex], currentIndex);
    }
  }, [currentIndex, content, onItemChange]);

  return {
    isEntered,
    currentIndex,
    currentItem: content[currentIndex],
    next,
  };
}
