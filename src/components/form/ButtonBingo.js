import { LoadingOutlined } from "@ant-design/icons";
import React, { forwardRef } from "reactn";
import { darkTheme } from "../../theme";
import styled from "styled-components";

export const ButtonBingo = forwardRef((props, ref) => {
  const theme =
    props.variant === "primary"
      ? darkTheme.buttonPrimary
      : props.variant === "secondary"
      ? darkTheme.buttonSecondary
      : darkTheme.buttonDefault;

  return (
    <ButtonCss theme={theme} ref={ref} {...props}>
      {props.loading && <LoadingOutlined />}
      {props.children}
    </ButtonCss>
  );
});

const ButtonCss = styled.button`
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-family: Lato;
  border-radius: 4px;
  font-size: ${(props) => props.fontSize ?? "14px"};
  color: ${(props) => props.theme.color};
  width: ${(props) => props.width ?? "auto"};
  margin: ${(props) => props.margin ?? "auto"};
  background: ${(props) => props.theme.background};
  text-align: ${(props) => props.align ?? "center"};
  box-shadow: 0 4px 0 ${(props) => props.theme.shadow};
  padding: ${(props) => props.padding ?? "10px 10px"};

  .anticon {
    margin: auto 5px !important;
  }

  &[disabled] {
    cursor: not-allowed;
    filter: contrast(0.5);
    pointer-events: all;
  }
`;
