import React from "reactn";
import styled from "styled-components";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { ButtonAnt } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";
import { SKIP_PHRASE } from "../../../../components/common/DataList";
import { useTranslation } from "../../../../hooks/useTranslation";

export const OverlayResult = (props) => {
  const { t } = useTranslation();

  return (
    <OverlayResultContainer className="flex flex-col pt-8">
      <div className="content">
        <div
          className={`label inline-block bg-secondarydarken py-8 px-8 md:px-24 ${
            props.gameState === SKIP_PHRASE && "text-primary"
          }`}
        >
          {props.gameState === SKIP_PHRASE
            ? t("pages.lobby.in-play.jump-phrase-message")
            : props.isGameOver
            ? t("pages.lobby.in-play.game-is-over")
            : ""}
        </div>
        <div className="max-w-[500px] m-[auto] bg-secondaryDarken min-h-[80px] mb-8 relative">
          {props.gameState !== SKIP_PHRASE && (
            <Image
              className="absolute left-1/2 top-[-1.2rem] translate-x-[-50%]"
              src={
                props.hasGuessed
                  ? `${config.storageUrl}/resources/success_guess.png`
                  : `${config.storageUrl}/resources/fail_guessed.png`
              }
              Desktopwidth="48px"
              width="48px"
              height="48px"
            />
          )}
          <div className={`label py-8 ${props.hasGuessed ? "success" : ""}`}>
            {t("pages.lobby.in-play.word-was")}: <span className="answer">{props.phrase}</span>
          </div>
        </div>
        {props.isGameOver ? (
          <ButtonAnt className="btn" color="default" onClick={() => props.onResetGame?.()}>
            {t("pages.lobby.in-play.play-again-button-label")}
          </ButtonAnt>
        ) : (
          <ButtonAnt className="btn" color="default" onClick={() => props.onContinue?.()}>
            {t("pages.lobby.in-play.next-button-label")}
          </ButtonAnt>
        )}
      </div>
    </OverlayResultContainer>
  );
};

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

    .label {
      margin-bottom: 56px;
      line-height: 1.4;

      &.success {
        color: ${(props) => props.theme.basic.success};
      }

      .answer {
        text-transform: uppercase;
        line-height: 1.4;
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
