import React from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../components/common/ModalContainer";
import { darkTheme } from "../../theme";
import { ButtonLobby } from "../../components/form";
import { useTranslation } from "../../hooks/useTranslation";

export const ModalVerification = (props) => {
  const { t } = useTranslation();

  return (
    <ModalContainer
      footer={null}
      closable={false}
      visible={props.isVisibleModalVerification}
      padding={"1rem"}
      topDesktop="20%"
      background={darkTheme.basic.whiteLight}
      onCancel={() => props.setIsVisibleModalVerification(props.email)}
    >
      <ContentModal>
        <div className="title">{t("pages.login.modal-container-title")}</div>
        <div className="description">{t("pages.login.modal-container-description")}</div>
        <ButtonLobby variant="secondary" width="200px" onClick={() => props.setIsVisibleModalVerification(props.email)}>
          {t("ok-button-label")}
        </ButtonLobby>
      </ContentModal>
    </ModalContainer>
  );
};

const ContentModal = styled.div`
  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .description {
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  button {
    display: block;
    margin-top: 10px;
  }
`;
