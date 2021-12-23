import React from "react";

class Input extends React.Component {
  render() {
    const { label, onChange, value, className, ...rest } = this.props;

    return (
      <div className="input-group">
        <input
          autoComplete="off"
          placeholder=" "
          onChange={onChange}
          value={value}
          type="text"
          name={label}
          id={label}
          aria-label={label}
          className={className ? className : ""}
          {...rest}
        />
        <label htmlFor={label}>{label}</label>
      </div>
    );
  }
}

export default Input;
