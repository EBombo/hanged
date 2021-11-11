import { ButtonAnt } from "../form";
import { ModalContainer } from "../common/ModalContainer";
import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";

export const ModalConfirm = (props) => (
  <ModalContainer
    background="#FAFAFA"
    footer={null}
    closable={false}
    padding="1rem"
    width="440px"
    topDesktop="30%"
    visible={props.isVisibleModalConfirm}
  >
    <ContentModal>
      <div className="title">{props.title}</div>
      <div className="description">{props.description}</div>
      <div className="btns-container">
        <ButtonAnt color="default" onClick={() => props.setIsVisibleModalConfirm(false)}>
          Cancelar
        </ButtonAnt>
        <ButtonAnt color="danger" onClick={props.action}>
          {props.buttonName || "Continuar"}
        </ButtonAnt>
      </div>
    </ContentModal>
  </ModalContainer>
);

const ContentModal = styled.div`
  width: 100%;

  .title {
    font-family: Encode Sans, sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
  }

  .description {
    margin: 1rem 0;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
  }

  .btns-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;
  }

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 18px;
      line-height: 22px;
    }
  }
`;
