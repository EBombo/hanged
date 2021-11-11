import React, { forwardRef } from "react";
import styled from "styled-components";
import { sizes } from "../../constants";

export const TextArea = forwardRef((props, ref) => (
  <InputContainer marginBottom={props.marginBottom}>
    {props.label && <Label required={props.required}>{props.label}</Label>}
    <InputWrapper>
      <span className="ant-input-wrapper ant-input-group" style={{ display: "table" }}>
        <StyledInput
          hasError={props.error}
          {...props}
          ref={ref}
          className={props.className ? props.className : "ant-input"}
        />
      </span>
    </InputWrapper>
    {props.error && <Error>{props.error.message}</Error>}
  </InputContainer>
));

const InputContainer = styled.div`
  margin-bottom: ${(props) => props.marginBottom || "1rem"} !important;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${sizes.font.mini};
  color: ${(props) => props.theme.basic.primary};

  ${(props) =>
    props.required &&
    `
    ::before {
        display: inline-block;
        margin-right: 4px;
        color: ${props.theme.basic.danger}
        font-size: 14px;
        line-height: 1;
        content: "*";
    }
  `}
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled.textarea`
  background: ${(props) => (props.background ? props.background : "transparent")};
  color: ${(props) => (props.color ? props.color : "white")};
  border: ${(props) => (props.border ? props.border : `1px solid ${props.theme.basic.primary}`)};
  ${(props) =>
    !props.addonBefore &&
    `
    border-radius: 4px !important;
  `};

  ${(props) =>
    props.hasError &&
    `
    background: ${(props) => (props.background ? props.background : "transparent")};
    border-color: ${props.theme.basic.danger};!important;
  `} ${(props) => props.borderRadius && `border-radius: ${props.borderRadius};`}
`;

const Error = styled.p`
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
