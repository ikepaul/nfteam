import React, { useRef } from "react";
import { useState } from "react";
import ReactDom from "react-dom";

class Button extends React.Component {
  state = {
    circles: [],
    circleCount: 0,
    timers: [],
  };

  circleEffect = e => {
    e.preventDefault();
    const x = e.clientX - e.target.offsetLeft;
    const y = e.clientY - e.target.offsetTop;
    let circles = this.state.circles;
    const circleCount = this.state.circleCount + 1;
    circles.push({ x, y, circleCount });
    this.setState({ circles, circleCount });

    const timer = setTimeout(() => {
      circles = this.state.circles;
      let filtered = 0;
      circles = circles.filter(circle => {
        if (circle.x != x || circle.y != y || filtered > 0) {
          return true;
        }
        filtered++;
        return false;
      });
      this.setState({ circles });
      clearTimeout(timer);
    }, 1000);

    const timers = this.state.timers;
    timers.push(timer);
    this.setState({ timer });
  };

  componentWillUnmount() {
    this.state.timers.forEach(timer => {
      clearTimeout(timer);
    });
  }

  render() {
    const { label, handleClick, disabled, ...rest } = this.props;
    return (
      <button
        disabled={disabled}
        {...rest}
        onClick={e => {
          e.preventDefault();
          this.circleEffect(e);
          handleClick(e);
        }}
      >
        {label}
        {this.state.circles &&
          this.state.circles.map(circle => {
            return (
              <span
                key={circle.circleCount}
                style={{ left: circle.x + "px", top: circle.y + "px" }}
              >
                3
              </span>
            );
          })}
      </button>
    );
  }
}

export default Button;
