import React, { forwardRef, Fragment } from "react";
import styled from "styled-components";
import { sizes } from "../../constants";
import { Checkbox as AntCheckbox } from "antd";

export const Checkbox = forwardRef((props, ref) => (
  <Fragment>
    {props.label && <Label required={props.required}>{props.label}</Label>}
    <CheckboxContainer>
      <StyledCheckboxGroup {...props} ref={ref} />
    </CheckboxContainer>
    {props.error && <Error>{props.errorMessage || props.error.message}</Error>}
  </Fragment>
));

const CheckboxContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledCheckboxGroup = styled(AntCheckbox)`
  margin-bottom: 1rem !important;
  ${(props) =>
    props.hasError &&
    `
    background-color: #fff;
    border-color: ${(props) => props.theme.basic.danger};
  `}
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
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${sizes.font.normal};

  ${(props) =>
    props.required &&
    `
    ::before {
        display: inline-block;
        margin-right: 4px;
        color: #f5222d;
        font-size: 14px;
        line-height: 1;
        content: "*";
    }
  `}
`;

const Error = styled.p`
  margin-top: -0.5rem;
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
