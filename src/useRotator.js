import { useState, useEffect, useCallback, useRef } from "react";

export default ({ content, transitionTime, startDelay, time }) => {
  let itemInterval;
  let itemTimeout;
  let displayTimeout;

  const indexRef = useRef(0);
  const [isEntered, setEntered] = useState(false);

  useEffect(() => {
    itemTimeout = setTimeout(() => {
      next();
      itemInterval = setInterval(next, time + transitionTime * 2);
    }, startDelay);

    return () =>
      clearTimeout(itemTimeout) &&
      clearInterval(itemInterval) &&
      clearTimeout(displayTimeout);
  }, [content]);

  const next = useCallback(() => {
    const itemIndex = indexRef.current;
    const itemContent = content[itemIndex];

    indexRef.current = itemContent ? itemIndex : 0;

    setEntered(true);

    displayTimeout = setTimeout(() => {
      setEntered(false);
      indexRef.current = indexRef.current + 1;
    }, time);
  }, [content]);

  const currentItemContent = content[indexRef.current];

  return {
    isEntered,
    indexRef,
    currentItemContent,
  };
};
