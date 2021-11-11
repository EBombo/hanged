import React, { forwardRef } from "reactn";
import styled from "styled-components";
import { darkTheme } from "../../theme";

export const InputBingo = forwardRef((props, ref) => {
  const theme = darkTheme.inputPrimary;
  return (
    <>
      <InputCss theme={theme} ref={ref} {...props} />
      {props.error && <Error>{props.error.message}</Error>}
    </>
  );
});

const InputCss = styled.input`
  border-radius: 4px;
  padding: 10px 10px;
  text-align: ${(props) => props.align ?? "unset"};
  margin: ${(props) => props.margin ?? "unset"};
  width: ${(props) => props.width ?? "auto"};
  color: ${(props) => props.theme.color};
  background: ${(props) => props.theme.background};
  box-shadow: ${(props) => props.theme.shadow};
  border: 1px solid ${(props) => props.theme.border};

  &[disabled] {
    cursor: not-allowed;
    filter: grayscale(1);
    pointer-events: none;
  }
`;

const Error = styled.p`
  font-size: 10px;
  color: red;
`;
