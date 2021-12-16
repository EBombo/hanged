import React, { useState } from "reactn";
import styled from "styled-components";
import { Collapse } from "antd";
import { ButtonAnt, Input, Select } from "./form";
import { mediaQuery } from "../constants";
import { secondsPerRoundOptions } from "./common/DataList";
import { config } from "../firebase";
import { Image } from "./common/Image";

const showLanguageOption = false;
const { Panel } = Collapse;

export const GameMenu = (props) => {
  const [phrases, setPhrases] = useState([...props.settings.phrases, ""]);

  return (
    <GameCss>
      <div>
        <div className="title">{props.game.name}</div>

        {props.showChooseGameMode && (
          <div className="container-game">
            <div className="item">
              <div>Versión Simple</div>
              <div>La manera sencilla</div>
              <ButtonAnt
                color="secondary"
                margin="auto"
                loading={props.isLoadingSave}
                disabled={props.isLoadingSave}
                onClick={() => props.createLobby("individual", phrases)}
              >
                Simple
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
                    <div className="title-opt">Idioma</div>
                  </div>
                  <Select />
                </div>
              )}

              <div className="option with-select">
                <div>
                  <div className="title-opt">Música en el Lobby</div>
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
                  <div className="title-opt">Segundos por ronda</div>
                </div>
                <Select
                  defaultValue={props.settings?.secondsPerRound ?? secondsPerRoundOptions[0]}
                  key={props.settings?.secondsPerRound ?? secondsPerRoundOptions[0]}
                  optionsdom={secondsPerRoundOptions.map((second) => ({
                    key: second,
                    code: second,
                    name: !second ? 'Sin tiempo' : second,
                  }))}
                  onChange={(value) => props.onSecondsPerRoundChange?.(value)}
                />
              </div>
              <div className="option with-custom-input">
                <div>
                  <div className="title-opt">Frases o palabras (Máx. 20 caractéres)</div>
                </div>

                <hr className="divider" />

                <div className="phrases-container">
                  {phrases.map((phrase, index) => (
                    <div className="input-container" key={`input-phrase-${index}`}>
                      <Input
                        onKeyPress={(event) => {
                          const regex = new RegExp("^[a-zA-Z ]+$");
                          const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                          if (!regex.test(key)) {
                            event.preventDefault();
                            return false;
                          }
                        }}
                        type="text"
                        maxLength={20}
                        defaultValue={phrase}
                        className="input-phrase"
                        placeholder="Insertar nueva frase/palabra"
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
                      className="btn"
                      color="secondary"
                      margin="auto"
                      loading={props.isLoadingSave}
                      disabled={props.isLoadingSave}
                    >
                      Agregar
                    </ButtonAnt>

                    {!props.showChooseGameMode && (
                      <ButtonAnt
                        className="btn success"
                        color="success"
                        margin="auto"
                        loading={props.isLoadingSave}
                        disabled={props.isLoadingSave}
                        onClick={() => props.onUpdateGame?.(phrases)}
                      >
                        Listo
                      </ButtonAnt>
                    )}
                  </div>
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
`;
