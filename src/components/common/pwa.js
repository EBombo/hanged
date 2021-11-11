import React, { useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { AppstoreAddOutlined, LoadingOutlined } from "@ant-design/icons";
import usePWA from "react-pwa-install-prompt";

const PWA = () => {
  const [loading, setLoading] = useState(false);
  const { isStandalone, isInstallPromptSupported, promptInstall } = usePWA();

  return isInstallPromptSupported && !isStandalone ? (
    <PWAIconCss
      onClick={async () => {
        setLoading(true);
        await promptInstall();
        setLoading(false);
      }}
    >
      {loading ? <LoadingOutlined /> : <AppstoreAddOutlined />}
    </PWAIconCss>
  ) : null;
};

const PWAIconCss = styled.div`
  background-color: ${(props) => props.theme.basic.blackDarken};
  color: ${(props) => props.theme.basic.primary};
  display: flex;
  position: fixed;
  bottom: 150px;
  right: 0;
  z-index: 9999;
  cursor: pointer;
  width: 65px;
  height: 60px;
  border-radius: 10px 0 0 10px;

  .anticon {
    margin: auto;
    font-size: 2rem;
  }

  ${mediaQuery.afterTablet} {
    bottom: 95px;
  }
`;

export default PWA;
