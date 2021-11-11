import styled from "styled-components";
import { Drawer } from "antd";
import { fontWeightFont } from "../../constants";

export const DrawerContainer = styled(Drawer)`
  .ant-drawer-mask {
    background-color: ${(props) => props.theme.basic.default} !important;
    opacity: 0.7 !important;
  }

  .ant-drawer-content-wrapper {
    width: 80% !important;

    .ant-drawer-header {
      background: ${(props) => props.theme.basic.black} !important;
      border: none !important;

      .ant-drawer-close {
        i {
          color: ${(props) => props.theme.basic.primary};
          ${fontWeightFont(700)};
        }
      }
    }

    .ant-drawer-body {
      background: ${(props) => props.theme.basic.blackLighten};
      width: 100% !important;
      height: 100% !important;
    }

    .ant-drawer-wrapper-body {
      .ant-drawer-header-no-title {
        .ant-drawer-close {
          color: ${(props) => props.theme.basic.white};
        }
      }
    }

    .ant-drawer-content {
      background: ${(props) => props.theme.basic.black} !important;
    }
  }
`;
