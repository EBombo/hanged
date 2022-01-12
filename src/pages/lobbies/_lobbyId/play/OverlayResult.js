import React from "reactn";
import styled from "styled-components";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { ButtonAnt } from "../../../../components/form";

export const OverlayResult = (props) => (
  <OverlayResultContainer>
    <div className="content">
      {props.isGameOver && <div className="label">¡Se acabó el juego!</div>}
      <>
        <Image
          className="status-icon"
          src={
            props.hasGuessed
              ? `${config.storageUrl}/resources/success_guess.png`
              : `${config.storageUrl}/resources/fail_guessed.png`
          }
          Desktopwidth="48px"
          width="48px"
        />
        <div className={`label ${props.hasGuessed ? "success" : ""}`}>La palabra era: <span class="answer">{props.phrase}</span></div>
      </>
      {props.isGameOver ? (
        <ButtonAnt className="btn" color="default" onClick={() => props.onResetGame?.()}>
          Jugar de nuevo
        </ButtonAnt>
      ) : (
        <ButtonAnt className="btn text-lg" color="default" onClick={() => props.onContinue?.()}>
          Siguiente
        </ButtonAnt>
      )}
    </div>
  </OverlayResultContainer>
);

const OverlayResultContainer = styled.div`
  position: fixed;
  top: 50px;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: ${(props) => props.theme.basic.secondaryWithTransparency};

  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;

  .content {
    color: ${(props) => props.theme.basic.whiteLight};
    text-align: center;
    padding-top: 32px;

    .status-icon {
      margin-bottom: 12px;
    }
    .label {
      margin-bottom: 24px;
      &.success {
        color: ${(props) => props.theme.basic.success};
      }

      .answer {
        text-transform: uppercase;
      }
    }
    .btn {
      display: inline-block;
      font-weight: bold;
      padding-left: 4rem;
      padding-right: 4rem;
    }
  }
`;
