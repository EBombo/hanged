import React from "reactn";
import styled from "styled-components";
import { Modal } from "antd";
import { mediaQuery } from "../../constants";

export const ModalContainer = (props) => (
  <ModalContainerCss {...props} maskStyle={{ transition: "none" }}>
    {props.children}
  </ModalContainerCss>
);

const ModalContainerCss = styled(Modal)`
  top: ${(props) => (props.top ? props.top : "10px")};

  ${mediaQuery.afterTablet} {
    top: ${(props) => (props.topDesktop ? props.topDesktop : "50px")};
    ${(props) => (props.width ? `width:${props.width}!important;` : "")}
  }

  .ant-modal-content {
    margin-bottom: 50px;
    ${(props) => (props.height ? `height:${props.height}!important;` : "")}
  }

  .ant-modal-close {
    color: ${(props) => props.theme.basic.primary};
  }

  .ant-modal-body {
    padding: ${(props) => (props.padding ? props.padding : "45px 24px 24px 24px")};
    background: ${(props) => props.background || props.theme.basic.blackDarken};
    color: ${(props) => props.color || props.theme.basic.white};
    border-radius: ${(props) => (props.borderRadius ? props.borderRadius : "6px")};
  }
`;
