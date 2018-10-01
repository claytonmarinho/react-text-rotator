// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

function transitions({ duration }) {
  return {
    "fade-default": {
      transition: `opacity ${duration}ms ease-in`,
      opacity: 0,
    }, 
  
    "fade-entering":  {
      opacity: 0,
    },
    
    "fade-entered": {
      opacity: 1,
    },
    
    "fade-exiting": {
      opacity: 0,
    },
    
    "fade-exited": {
      opacity: 0,
    },   
  }
}

type Props = {
  content: Array<Object>,
  time: number,
  startDelay: number,
  transitionTime: number,
};

type State = {
  current: any,
  index: number,
  entered: boolean,
};

class TextRotator extends React.Component<Props, State> {
  static defaultProps = {
    time: 2500,
    startDelay: 250,
    transitionTime: 500,
  }

  state = {
    current: null,
    index: 0,
    entered: false,
  }

  willUnmount = false;
  interval: any;
  timeOut: any;

  componentDidMount() {
    this.trigger();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.timeOut);
    this.willUnmount = true;
  }

  trigger = () => {
    const { content, startDelay, time } = this.props;
   
    if (content.length > 0) {
      this.timeOut = setTimeout(() => {
        this.next();
        this.interval = setInterval(() => this.next(), time);
      }, startDelay);
    }   
  }

  next = () => {
    if (!this.willUnmount) {
      const { content, time } = this.props;
      const currentStep = this.state.index;
      const total = content.length || 0;
      
      let index = 0;
      
      if (this.state.current) {
        index = (total === currentStep + 1) ? 0 : currentStep + 1;    
      }
      
      const current = content[index];
      this.setState({ index });
      this.setCurrent(current);
    }
  }

  setCurrent = (item: Object) => {
    const { time, transitionTime } = this.props;
    this.setState({ current: item, entered: true });
    setTimeout(() => this.setState({ entered: false }), time - transitionTime)
  }

  render() {
    const { transitionTime, content } = this.props;
    const { current, index, entered } = this.state;
    const { className, animation = 'fade', text } = current || (content && content[0]) || {};
    const styles = transitions({ duration: transitionTime });

    if (!text) return <span />;

    return (
      <Transition in={entered} timeout={transitionTime} >
        {state => (
          <span 
            key={index}
            className={className}
            style={{ ...styles[`${animation}-default`], ...styles[`${animation}-${state}`]}}
          >{text}</span> 
        )}
      </Transition>
    );
  }
}

export default TextRotator;
