import styled from "styled-components";
import { Select as AntSelect } from "antd";
import React from "react";
import { sizes } from "../../constants";

export const Select = ({ variant = "default", optionsdom, ...props }) => (
  <SelectContainer variant={variant}>
    {props.label && (
      <Label required={props.required} variant={variant}>
        {props.label}
      </Label>
    )}
    <StyledSelect {...props} variant={variant}>
      {optionsdom
        ? optionsdom.map((option) => (
            <AntSelect.Option key={option.key} className={variant} value={option.code}>
              {option.name}
            </AntSelect.Option>
          ))
        : props.children}
    </StyledSelect>
    {props.error && <Error>{props.error.message}</Error>}
  </SelectContainer>
);

const SelectContainer = styled.div`
  .ant-select-open {
    .ant-select-selection {
      box-shadow: 0 0 0 2px ${(props) => props.theme.basic.primary} !important;
    }
  }
`;

const StyledSelect = styled(AntSelect)`
  width: 100%;
  border: none;

  .ant-select-selector {
    border: none !important;
    font-size: ${sizes.font.small};
    height: auto !important;
    border-radius: 2px;
    background: ${(props) => props.theme.basic.whiteLight};

    .ant-select-selection-item {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.basic.grayLight} !important;
    }
  }

  .ant-select-arrow {
    color: ${(props) => props.theme.basic.grayLight} !important;

    span {
      svg {
        cursor: pointer;
        color: ${(props) => props.theme.basic.grayLight};
      }
    }
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 16px;
  font-size: ${sizes.font.mini};

  color: ${(props) => (props.variant === "primary" ? props.theme.basic.primary : props.theme.basic.default)};

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
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
