import React from "reactn";
import styled from "styled-components";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { ButtonAnt } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";

export const OverlayResult = (props) => (
  <OverlayResultContainer className="flex flex-col justify-center">
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
          height="48px"
        />
        <div className={`label ${props.hasGuessed ? "success" : ""}`}>La palabra era: <span class="answer">{props.phrase}</span></div>
      </>
      {props.isGameOver ? (
        <ButtonAnt className="btn" color="default" onClick={() => props.onResetGame?.()}>
          Jugar de nuevo
        </ButtonAnt>
      ) : (
        <ButtonAnt className="btn" color="default" onClick={() => props.onContinue?.()}>
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

  ${mediaQuery.afterTablet} {
    font-size: 32px;
  }

  .content {
    color: ${(props) => props.theme.basic.whiteLight};
    text-align: center;
    margin-top: -52px;

    .status-icon {
      margin-bottom: 12px;
    }
    .label {
      margin-bottom: 56px;
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
      font-size: 18px;
    }
  }
`;
