import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Transition } from "react-transition-group";

function transitions({ duration }) {
  return {
    "fade-default": {
      transition: `opacity ${duration}ms ease-in`,
      opacity: 0
    },

    "fade-entering": {
      opacity: 0
    },

    "fade-entered": {
      opacity: 1
    },

    "fade-exiting": {
      opacity: 0
    },

    "fade-exited": {
      opacity: 0
    }
  };
}

let interval;
let timeout;
let enteredTimeout;

function TextRotator({ content, time, startDelay, transitionTime }) {
  const indexRef = useRef(0);
  const [entered, setEntered] = useState(false);
  const { className, animation = "fade", text } =
    content[indexRef.current] || {};
  const styles = transitions({ duration: transitionTime });

  useEffect(() => {
    timeout = setTimeout(() => {
      next();
      interval = setInterval(next, time);
    }, startDelay);

    return () =>
      clearTimeout(timeout) &&
      clearInterval(interval) &&
      clearTimeout(enteredTimeout);
  }, []);

  function next() {
    const total = content.length || 0;
    indexRef.current = content[indexRef.current + 1] ? indexRef.current + 1 : 0;
    setEntered(true);
    enteredTimeout = setTimeout(() => setEntered(false), time - transitionTime);
  }

  if (!text) return <span />;

  return (
    <Transition in={entered} timeout={transitionTime}>
      {state => (
        <span
          key={indexRef}
          className={className}
          style={{
            ...styles[`${animation}-default`],
            ...styles[`${animation}-${state}`]
          }}
        >
          {text}
        </span>
      )}
    </Transition>
  );
}

TextRotator.propTypes = {
  time: PropTypes.number,
  startDelay: PropTypes.number,
  transitionTime: PropTypes.number,
  content: PropTypes.arrayOf(PropTypes.object).isRequired
};

TextRotator.defaultProps = {
  time: 2500,
  startDelay: 250,
  transitionTime: 500
};

export default TextRotator;
