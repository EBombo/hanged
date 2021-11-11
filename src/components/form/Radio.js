import React, { forwardRef, Fragment } from "react";
import styled from "styled-components";
import { sizes } from "../../constants";
import { Radio as AntRadio } from "antd";

export const Radio = forwardRef((props, ref) => (
  <Fragment>
    {props.label && <Label required={props.required}>{props.label}</Label>}
    <RadioContainer>
      <StyledRadioGroup {...props} hasError={props.error} ref={ref} />
    </RadioContainer>
    {props.error && <Error>{props.errorMessage || props.error.message}</Error>}
  </Fragment>
));

const RadioContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledRadioGroup = styled(AntRadio.Group)`
  margin-bottom: 1rem !important;
  ${(props) =>
    props.hasError &&
    `
    background-color: #fff;
    border-color: ${(props) => props.theme.basic.danger};
  `}
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${sizes.font.mini};

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
