import React from "react";
import styled from "styled-components";

export const Anchor = (props) => (
  <AnchorTag href={props.url} target={props.target || "_blank"} rel="noreferrer" {...props}>
    {props.children}
  </AnchorTag>
);

const AnchorTag = styled.a`
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 500)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "11px")};
  text-decoration: ${(props) => (props.underlined ? `underline` : "")};
  border: ${(props) => (props.border ? props.border : "")};
  margin: ${(props) => (props.margin ? props.margin : "")};
  padding: ${(props) => (props.padding ? props.padding : "")};
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  display: ${(props) => (props.display ? props.display : "")};
  color: ${({ variant = "default", theme }) =>
    variant === "primary"
      ? theme.basic.primary
      : variant === "secondary"
      ? theme.basic.secondary
      : variant === "warning"
      ? theme.basic.warning
      : variant === "danger"
      ? theme.basic.danger
      : theme.basic.default};

  :hover {
    text-decoration: ${(props) => (props.underlined ? `underline` : "")};
    text-shadow: 0 0 10px
      ${({ variant = "default", theme }) =>
        variant === "primary"
          ? theme.basic.primary
          : variant === "secondary"
          ? theme.basic.secondary
          : variant === "warning"
          ? theme.basic.warning
          : variant === "danger"
          ? theme.basic.danger
          : theme.basic.primary};
  }

  &[disabled] {
    cursor: not-allowed;
    filter: grayscale(1);
    pointer-events: none;
    color: ${(props) => props.theme.basic.whiteDarken} !important;
  }
`;
