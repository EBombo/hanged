import React, { useState, useEffect } from "reactn";
import styled from "styled-components";
import { Collapse } from "antd";
import { ButtonAnt, Input, Select } from "./form";
import { mediaQuery } from "../constants";
import { MAX_PHRASE_LENGTH, secondsPerRoundOptions, bannedLetters, allowedLetters } from "./common/DataList";
import { config } from "../firebase";
import { Image } from "./common/Image";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "../hooks/useTranslation";

const showLanguageOption = false;
const { Panel } = Collapse;

export const GameMenu = (props) => {
  const { t } = useTranslation();

  const [phrases, setPhrases] = useState([...props.settings.phrases, ""]);

  const validationSchema = yup.object().shape({
      phrase: yup.array().of(
          yup.string()
            .matches(allowedLetters, "Only letters, signs ?¿!¡, whitespace ( ) and comma (,) are allowed for this field ")
      )
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: validationSchema,
    reValidateMode: "onBlur",
  });

  const updateGame = () => {
    props.onUpdateGame?.(phrases);
  };

  return (
    <GameCss>
      <div>
        <div className="title">{props.game.name}</div>

        {props.showChooseGameMode && (
          <div className="container-game">
            <div className="item">
              <div>{t("pages.lobby.game-settings.simple-game-mode-label")}</div>
              <div>{t("pages.lobby.game-settings.simple-game-mode-description")}</div>
              <ButtonAnt
                className="btn-bold"
                color="success"
                margin="auto"
                loading={props.isLoadingSave}
                disabled={props.isLoadingSave}
                onClick={() => props.createLobby("individual", phrases)}
              >
                {t("pages.lobby.game-settings.play-button-label")}
              </ButtonAnt>
            </div>
          </div>
        )}

        <Collapse defaultActiveKey={["1"]} accordion>
          <Panel header="Opciones del juego" key="1">
            <div className="options">
              {showLanguageOption && (
                <div className="option with-select">
                  <div>
                    <div className="title-opt">{t("language")}</div>
                  </div>
                  <Select />
                </div>
              )}

              <div className="option with-select">
                <div>
                  <div className="title-opt">{t("pages.lobby.game-settings.lobby-music-title")} </div>
                </div>
                <Select
                  defaultValue={props.game?.audio?.id ?? props.audios[0]?.id}
                  key={props.game?.audio?.id ?? props.audios[0]?.id}
                  optionsdom={props.audios.map((audio) => ({
                    key: audio.id,
                    code: audio.id,
                    name: audio.title,
                  }))}
                  onChange={(value) => props.onAudioChange?.(value)}
                />
              </div>
              <div className="option with-select">
                <div>
                  <div className="title-opt">{t("pages.lobby.game-settings.seconds-per-round-option-label")}</div>
                </div>
                <Select
                  defaultValue={props.settings?.secondsPerRound ?? secondsPerRoundOptions[0]}
                  key={props.settings?.secondsPerRound ?? secondsPerRoundOptions[0]}
                  optionsdom={secondsPerRoundOptions.map((second) => ({
                    key: second,
                    code: second,
                    name: second ?? t("pages.lobby.game-settings.no-time"),
                  }))}
                  onChange={(value) => props.onSecondsPerRoundChange?.(value)}
                />
              </div>
              <div className="option with-custom-input">
                <div>
                  <div className="title-opt">{t("pages.lobby.game-settings.phrases-descriptions")}</div>
                </div>

                <hr className="divider" />

                <div className="phrases-container">
                  <form action="" onSubmit={handleSubmit(updateGame)}>
                    {phrases.map((phrase, index) => (
                      <div className="input-container" key={`input-phrase-${index}`}>
                        <Input
                          ref={register}
                          name={`phrase[${index}]`}
                          onKeyPress={(event) => {
                            const regex = allowedLetters;
                            const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                            if (!regex.test(key)) {
                              event.preventDefault();
                              return false;
                            }
                          }}
                          onPaste={(ev) => {
                            const pasteText = ev.clipboardData.getData("text")

                            if (phrase.length + pasteText.length > MAX_PHRASE_LENGTH) return;

                            const newPhrase = `${phrase}${pasteText}`.replaceAll(bannedLetters, '');

                            ev.target.value = newPhrase;

                            ev.preventDefault();
                          }}
                          type="text"
                          maxLength={MAX_PHRASE_LENGTH}
                          defaultValue={phrase}
                          error={errors?.phrase?.[index]}
                          className="input-phrase"
                          placeholder={t("pages.lobby.game-settings.new-phrase-placeholder")}
                          onBlur={(e) => {
                            let newPhrase = phrases;
                            newPhrase[index] = e.target.value;
                            setPhrases([...newPhrase]);
                          }}
                        />
                        <button
                          className="btn-delete"
                          onClick={() => {
                            let newPhrases = phrases.filter((phrase, idx) => idx !== index);

                            setPhrases([...newPhrases]);
                          }}
                        >
                          <Image
                            src={`${config.storageUrl}/resources/close.svg`}
                            height="15px"
                            width="15px"
                            cursor="pointer"
                            size="contain"
                            margin="0"
                          />
                        </button>
                      </div>
                    ))}
                  
                    <div className="btn-container">
                      <ButtonAnt
                        onClick={() => setPhrases([...phrases, ""])}
                        className="btn btn-bold"
                        color="secondary"
                        margin="auto"
                        loading={props.isLoadingSave}
                        disabled={props.isLoadingSave}
                      >
                        {t("pages.lobby.game-settings.add-button-label")}
                      </ButtonAnt>

                      {!props.showChooseGameMode && (
                        <>
                          <ButtonAnt
                            className="btn btn-bold"
                            color="danger"
                            margin="auto"
                            loading={props.isLoadingSave}
                            disabled={props.isLoadingSave}
                            onClick={() => props.setGameMenuEnabled(false)}
                          >
                            {t("pages.lobby.game-settings.cancel-button-label")}
                          </ButtonAnt>

                          {/* onClick={() => props.onUpdateGame?.(phrases)} */}
                          <ButtonAnt
                            className="btn success btn-bold"
                            color="success"
                            margin="auto"
                            loading={props.isLoadingSave}
                            disabled={props.isLoadingSave}
                            htmlType="submit"
                          >
                            {t("pages.lobby.game-settings.save-button-label")}
                          </ButtonAnt>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    </GameCss>
  );
};

const GameCss = styled.div`
  width: 100%;
  margin: auto;
  max-width: 500px;
  padding: 1rem;
  color: ${(props) => props.theme.basic.white};

  ${mediaQuery.afterTablet} {
    padding: 20px;
  }

  .title {
    border: none;
    width: 100%;
    margin: auto;
    font-size: 14px;
    font-weight: 700;
    font-family: Lato;
    text-align: center;
    border-radius: 4px;
    padding: 10px 10px;
    color: ${(props) => props.theme.basic.black};
    background: ${(props) => props.theme.basic.whiteDark};
    box-shadow: 0 4px 0 ${(props) => props.theme.basic.grayLighten};
  }

  .container-game {
    grid-gap: 5px;
    padding: 10px 5px 5px 5px;
    display: grid;
    grid-template-columns: 1fr;

    .item {
      font-family: Lato;
      padding: 15px;
      font-size: 15px;
      line-height: 2rem;
      border-radius: 4px;
      text-align: center;
      background: ${(props) => props.theme.basic.primary};
    }
  }

  .btn-large {
    display: block;

    .anticon {
      margin: 5px !important;
      float: right !important;
    }
  }

  .options {
    .title {
      margin: 10px auto;
      text-align: center;
      font-weight: bold;
    }

    .option {
      display: grid;
      grid-template-columns: 5fr 1fr;
      align-items: center;
      margin: 2px auto;
      padding: 5px 10px;
      font-size: 13px;
      line-height: 16px;
      background: ${(props) => props.theme.basic.primaryDarken};
      color: ${(props) => props.theme.basic.whiteLight};
      border-radius: 2px;

      span {
        font-family: Lato;
        font-style: normal;
        font-weight: 300;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.whiteLight};
      }

      .title-opt {
        font-weight: bold;
      }

      .ant-switch {
        margin: auto !important;
      }

      .input-phrase {
        margin: 0.5rem;
      }
    }

    .with-select {
      grid-template-columns: 5fr 3fr;
    }

    .with-custom-input {
      grid-template-columns: 1fr;
    }

    .divider {
      margin: 1rem 0;
    }

    .input-phrase {
      background: ${(props) => props.theme.basic.secondary};
      color: ${(props) => props.theme.basic.white};
      border: 0;
    }

    .btn-container {
      display: flex;
      justify-content: space-between;
      margin: 1rem 0;

      .btn {
        margin: 0 8px;

        &.success {
          span {
            color: ${(props) => props.theme.basic.secondary} !important;
          }
        }
      }
    }
  }

  .phrases-container {
    .input-container {
      margin: 0.5rem 0;
      position: relative;

      .btn-delete {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        z-index: 999;
        width: 15px;
        height: 15px;
      }
    }

    .input-phrase {
      width: 100%;
      height: 32px;
      background: ${(props) => props.theme.basic.secondary};
      color: ${(props) => props.theme.basic.whiteLight};
      border-radius: 4px !important;
      font-family: Lato;
      font-style: normal;
      font-weight: 300;
      font-size: 13px;
      line-height: 16px;
      border: none !important;
    }
  }

  .ant-collapse {
    border: none !important;

    .ant-collapse-item {
      border: none !important;
    }
  }

  .ant-collapse-header {
    font-size: 14px;
    font-weight: 700;
    font-family: Lato;
    text-align: center;
    border-radius: 4px !important;
    color: ${(props) => props.theme.basic.black};
    background: ${(props) => props.theme.basic.whiteDark};
    box-shadow: 0 4px 0 ${(props) => props.theme.basic.grayLighten};
    text-align: left;
    position: relative;

    .anticon {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .ant-collapse-content {
    background: ${(props) => props.theme.basic.secondary} !important;
  }

  .btn-bold {
    font-weight: bold;

    span {
      font-weight: bold !important;
    }
  }
`;
