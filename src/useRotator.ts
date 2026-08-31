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
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }
    if (displayTimerRef.current) {
      clearTimeout(displayTimerRef.current);
      displayTimerRef.current = null;
    }
  }, []);

  const scheduleExit = useCallback(() => {
    if (displayTimerRef.current) {
      clearTimeout(displayTimerRef.current);
    }
    displayTimerRef.current = setTimeout(() => {
      setIsEntered(false);
    }, time);
  }, [time]);

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
    clearAllTimers();
    indexRef.current = 0;
    setCurrentIndex(0);
    setIsEntered(false);

    if (!autoPlay || content.length === 0) {
      return;
    }

    startTimerRef.current = setTimeout(() => {
      enterCurrent();
    }, startDelay);

    return clearAllTimers;
  }, [content, autoPlay, startDelay, enterCurrent, clearAllTimers]);

  useEffect(() => {
    if (onItemChange && content.length > 0) {
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
