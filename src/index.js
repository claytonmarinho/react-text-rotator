import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import './styles/transitions.less';

class TextRotator extends Component {
  constructor() {
    super();

    this.state = {
      current: null,
      index: 0,
    };

    this.willUnmount = false;
  }

  componentDidMount() {
    this.startTextRotator();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.timeOut);
    this.willUnmount = true;
  }

  startTextRotator = () => {
    const { content, startDelay, time } = this.props;

    if (content && content.length === 1) {
      this.setState({ current: content[0] });
    } else if (content && content.length > 1) {
      const current = content[0];
      this.setState({ current });

      this.timeOut = setTimeout(() => {
        this.interval = setInterval(() => {
          this.nextText();
        }, time);
      }, startDelay);
    }    
  }

  nextText = () => {
    if (!this.willUnmount) {
      const { content } = this.props;
      const currentStep = this.state.index;
      const total = content.length || 0;
      const index = (total === currentStep + 1) ? 0 : currentStep + 1;
      const current = content[index];

      this.setState({ current, index });
    }
  }

  render() {
    const { current, index } = this.state;
    const { className, animation = 'fade', text } = current || {};

    if (!text) return <span />;

    return (
      <CSSTransitionGroup
        transitionName={`react-text-rotator-${animation}`}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={0}
        transitionLeave={false}
      >
        <span key={index} className={className}>{text}</span>
      </CSSTransitionGroup>
    );
  }
}

TextRotator.propTypes = {
	content: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
    animation: PropTypes.oneOf(['fade']),
  })).isRequired,
  time: PropTypes.number,
  startDelay: PropTypes.number,
};

TextRotator.defaultProps = {
  time: 2500,
  startDelay: 0,
};

export default TextRotator;
