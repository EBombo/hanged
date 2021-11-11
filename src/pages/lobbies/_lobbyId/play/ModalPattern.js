import React from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { CardPattern } from "./CardPattern";
import { mediaQuery } from "../../../../constants";

export const ModalPattern = (props) => (
  <ModalContainer
    background="#331E6C"
    footer={null}
    topDesktop="20%"
    padding="1rem"
    visible={props.isVisibleModalPattern}
    onCancel={() => props.setIsVisibleModalPattern(false)}
  >
    <Content>
      <div className="title">
        {!props.lobby.startGame
          ? "Por favor llene el patrón para empezar el juego"
          : "Si cambia el patrón podría ya haber un ganador"}
      </div>
      <div className="card-container">
        <div className="subtitle">Patrón a completar</div>
        <CardPattern isEdit cancelAction={() => props.setIsVisibleModalPattern(false)} {...props} />
      </div>
    </Content>
  </ModalContainer>
);

const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: 900;
    font-size: 20px;
    line-height: 24px;
    color: ${(props) => props.theme.basic.white};
  }

  .card-container {
    padding: 1rem;
    background: ${(props) => props.theme.basic.secondary};
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    margin: 1rem 0;

    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: ${(props) => props.theme.basic.white};
    }
  }

  ${mediaQuery.afterTablet} {
    font-size: 20px;
    line-height: 24px;
  }
`;
