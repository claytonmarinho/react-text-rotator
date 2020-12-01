import { useState, useEffect, useCallback, useRef } from "react";

export default ({ content, transitionTime, startDelay, time }) => {
  let itemInterval;
  let itemTimeout;
  let isEnteredTimeout;

  const indexRef = useRef(0);
  const [isEntered, setEntered] = useState(false);

  useEffect(() => {
    itemTimeout = setTimeout(() => {
      next();
      itemInterval = setInterval(next, time);
    }, startDelay);

    return () =>
      clearTimeout(itemTimeout) &&
      clearInterval(itemInterval) &&
      clearTimeout(isEnteredTimeout);
  }, [content]);

  const next = useCallback(() => {
    const nextItemIndex = indexRef.current + 1;
    const nextItemContent = content[nextItemIndex];

    indexRef.current = nextItemContent ? nextItemIndex : 0;

    setEntered(true);

    isEnteredTimeout = setTimeout(
      () => setEntered(false),
      time - transitionTime
    );
  }, [content]);

  const currentItemContent = content[indexRef.current] || {};

  return {
    isEntered,
    indexRef,
    currentItemContent,
  };
};
