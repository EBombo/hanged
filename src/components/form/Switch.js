import React, { useRef } from "react";
import styled from "styled-components";

export const Switch = (props) => {
  const inputRef = useRef(null);

  const selectedInput = () => {
    switch (props.variant) {
      case "switcher":
        return (
          <Switcher onClick={() => inputRef?.current?.click()} {...props}>
            <input
              ref={inputRef}
              id="language-toggle"
              className="check-toggle check-toggle-round-flat"
              type="checkbox"
              defaultChecked={props.defaultChecked}
              onChange={props.onChange}
            />
            <label htmlFor="language-toggle" />
            <span className="on">{props.label1}</span>
            <span className="off">{props.label2}</span>
          </Switcher>
        );
      case "toggle":
        return (
          <ToggleSwitch className="toggle-wrapper" onClick={() => inputRef?.current?.click()} {...props}>
            <input
              ref={inputRef}
              className="toggle-switch"
              type="checkbox"
              id="toggle-switch"
              checked={props.checked}
              onChange={props.onChange}
            />
            <label htmlFor="toogle-switch" className="label" />
          </ToggleSwitch>
        );
      default:
        return (
          <ToggleSwitch className="toggle-wrapper" onClick={() => inputRef?.current?.click()} {...props}>
            <input
              ref={inputRef}
              className="toggle-switch"
              type="checkbox"
              id="toggle-switch"
              checked={props.checked}
              onChange={props.onChange}
            />
            <label htmlFor="toogle-switch" className="label" />
          </ToggleSwitch>
        );
    }
  };

  return selectedInput();
};

const ToggleSwitch = styled.div`
  .toggle-switch {
    position: absolute;
    margin-left: -9999px;
    visibility: hidden;
  }

  .label {
    cursor: pointer;
    text-indent: -9999px;
    width: ${(props) => (props.size === "small" ? "28px" : props.size === "medium" ? "35px" : "45px")};
    height: ${(props) => (props.size === "small" ? "16px" : props.size === "medium" ? "20px" : "25px")};
    background: #c4c4c4;
    display: block;
    border-radius: 100px;
    position: relative;
  }

  .label:after {
    content: "";
    position: absolute;
    top: ${(props) => (props.size === "small" ? "3px" : props.size === "medium" ? "4px" : "5px")};
    left: 5px;
    width: ${(props) => (props.size === "small" ? "10px" : props.size === "medium" ? "13px" : "15px")};
    height: ${(props) => (props.size === "small" ? "10px" : props.size === "medium" ? "12px" : "15px")};
    background: #fff;
    border-radius: 90px;
    transition: 0.3s;
  }

  .toggle-switch:checked + .label {
    background: #32c78d;
  }

  .toggle-switch:checked + .label:after {
    left: calc(100% - 5px);
    transform: translateX(-100%);
  }

  .label:active:after {
    width: ${(props) => (props.size === "small" ? "15px" : props.size === "medium" ? "20px" : "30px")};
  }
`;

const Switcher = styled.div`
  position: relative;
  display: inline-block;

  .on,
  .off {
    position: absolute;
    top: 50%;
    pointer-events: none;
    font-family: "Helvetica", Arial, sans-serif;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    width: 50%;
    text-align: center;
    color: #382079;
    transform: translateY(-50%);
  }

  .on {
    left: 0;
    padding-left: 2px;
  }

  .off {
    right: 0;
    padding-right: 4px;
  }

  .check-toggle {
    position: absolute;
    margin-left: -9999px;
    visibility: hidden;
  }

  .check-toggle + label {
    display: block;
    position: relative;
    cursor: pointer;
    outline: none;
  }

  .check-toggle-round-flat + label {
    background-color: #56eea5;
    padding: 2px;
    width: ${(props) => (props.size === "small" ? "55px" : "80px")};
    height: 25px;
    border-radius: 60px;
  }

  label::after,
  label::before {
    display: block;
    position: absolute;
    content: "";
  }

  label::after {
    top: 4px;
    left: 4px;
    bottom: 4px;
    width: ${(props) => (props.size === "small" ? "25px" : "35px")};
    background-color: #fff;
    border-radius: 52px;
    transition: margin 0.2s;
  }

  label::before {
    top: 5px;
    right: 2px;
    bottom: 5px;
    left: 2px;
    background-color: #56eea5;
    border-radius: 60px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }

  .check-toggle-round-flat:checked + label:after {
    margin-left: ${(props) => (props.size === "small" ? "23px" : props.size === "medium" ? "36px" : "39px")};}
`;

