import React from "react";
import PropTypes from "prop-types";
import Transition from "react-transition-group/Transition";
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

  const { className = "", animation = "fade", text, link } = currentItemContent || {};

  return (
    <Transition in={isEntered} timeout={transitionTime}>
      {(state) => {
        if (!currentItemContent || !text) {
          return <></>;
        }

        const style = {
          ...styles[`${animation}-default`],
          ...styles[`${animation}-${state}`],
        };

        return (
          <div key={indexRef} className={className} style={style}>
            {link ? <a href={link}>{text}</a> : text}
          </div>
        )

      }}
    </Transition>
  );
};

const ContentItem = PropTypes.shape({
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  animation: PropTypes.string,
  link: PropTypes.string,
});

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
