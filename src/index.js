import React from "react";
import PropTypes from "prop-types";
import { Transition } from "react-transition-group";
import useRotator from "./useRotator";
import transitions from "./transitions";

const TextRotator = ({ content, time, startDelay, transitionTime }) => {
  const styles = transitions({ duration: transitionTime });

  const { isEntered, indexRef, currentItemContent } = useRotator({
    content,
    transitionTime,
    startDelay,
    time,
  });

  const { className, animation, text } = currentItemContent;

  if (!text) {
    return <span />;
  }

  return (
    <Transition in={isEntered} timeout={transitionTime}>
      {(state) => {
        const spanStyle = {
          ...styles[`${animation}-default`],
          ...styles[`${animation}-${state}`],
        };
        return (
          <span key={indexRef} className={className} style={spanStyle}>
            {text}
          </span>
        );
      }}
    </Transition>
  );
};

const ContentItem = PropTypes.shape({
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  animation: PropTypes.string,
});

ContentItem.defaultProps = {
  animation: "fade",
};

TextRotator.propTypes = {
  time: PropTypes.number,
  startDelay: PropTypes.number,
  transitionTime: PropTypes.number,
  content: PropTypes.arrayOf(ContentItem).isRequired,
};

TextRotator.defaultProps = {
  time: 2500,
  startDelay: 250,
  transitionTime: 500,
};

export default TextRotator;
