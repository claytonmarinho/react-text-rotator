import { useRef, type ReactNode } from "react";
import { Transition } from "react-transition-group";
import useRotator from "./useRotator";
import transitions from "./transitions";
import type { RotatorItem, TextRotatorProps } from "./types";

const normalizeItem = (item: string | RotatorItem): RotatorItem =>
  typeof item === "string" ? { text: item } : item;

const TextRotator = ({
  content,
  time = 2500,
  startDelay = 250,
  transitionTime = 500,
  className = "",
  style,
  autoPlay = true,
  onItemChange,
}: TextRotatorProps) => {
  const styles = transitions({ duration: transitionTime });
  const { isEntered, currentIndex, currentItem, next } = useRotator({
    content,
    time,
    startDelay,
    autoPlay,
    onItemChange,
  });
  const nodeRef = useRef<HTMLDivElement | null>(null);

  if (currentItem == null) {
    return null;
  }

  const item = normalizeItem(currentItem);
  const {
    text,
    children,
    link,
    target,
    className: itemClassName = "",
    style: itemStyle,
    animation = "fade",
    render,
  } = item;

  return (
    <Transition in={isEntered} timeout={transitionTime} onExited={next} nodeRef={nodeRef}>
      {(state) => {
        const mergedStyle = {
          ...styles[`${animation}-default`],
          ...styles[`${animation}-${state}`],
          ...style,
          ...itemStyle,
        };

        let inner: ReactNode;
        if (render) {
          inner = render(item, currentIndex);
        } else if (children !== undefined && children !== null) {
          inner = children;
        } else if (link) {
          inner = (
            <a href={link} target={target}>
              {text}
            </a>
          );
        } else {
          inner = text;
        }

        return (
          <div ref={nodeRef} className={`${className} ${itemClassName}`.trim()} style={mergedStyle}>
            {inner}
          </div>
        );
      }}
    </Transition>
  );
};

export default TextRotator;
