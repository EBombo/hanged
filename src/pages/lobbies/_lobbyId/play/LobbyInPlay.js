import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import every from "lodash/every";
import includes from "lodash/includes";
import { mediaQuery } from "../../../../constants";
import { UserLayout } from "../userLayout";
import { firestore, config } from "../../../../firebase";
import { HangedMan } from "./HangedMan";
import { Timer } from "./Timer";
import { Alphabet } from "./Alphabet";
import { OverlayResult } from "./OverlayResult";
import { ButtonAnt } from "../../../../components/form";
import { GameSettings } from "./GameSettings";
import { useInterval } from "../../../../hooks/useInterval";
import { PauseOutlined, CaretRightOutlined, FastForwardOutlined } from "@ant-design/icons";
import { defaultHandMan, GUESSED, HANGED, limbsOrder, PLAYING, TIME_OUT, SKIP_PHRASE } from "../../../../components/common/DataList";

const isLastRound = (lobby) => lobby.currentPhraseIndex + 1 === lobby.settings.phrases.length;

const getLivesLeft = (hangedMan) => Object.values(hangedMan).filter((limb) => limb === "hidden").length;

const phraseIsGuessed = (letters, phrase) => every(phrase, (letter) => includes(letters, letter));

export const LobbyInPlay = (props) => {
  const [authUser] = useGlobal("user");

  const [lobby, setLobby] = useState(props.lobby);

  const [hasStarted, setHasStarted] = useState(false);
  const [hasPaused, setHasPaused] = useState(false);

  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [gameMenuEnabled, setGameMenuEnabled] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(props.lobby.secondsLeft ?? props.lobby.settings.secondsPerRound);

  const [alertText, setAlertText] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (hasStarted && !props.lobby.hasStarted) {
      setSecondsLeft(props.lobby.settings.secondsPerRound)
      setLobby({...lobby, hasStarted: true, startAt: new Date()})
    };
  }, [hasStarted]);

  useEffect(() => {
    const currentUserId = authUser.id;
    if (props.lobby?.users?.[currentUserId]) return;
    if (props.lobby.game.usersIds.includes(currentUserId)) return;

    props.logout();
  }, [props.lobby.users]);

  useEffect(() => {
    const updateLobby = async () =>
      await firestore.doc(`lobbies/${props.lobby.id}`).update({
        ...lobby,
        updateAt: new Date(),
      });

    updateLobby();
  }, [lobby]);

  useEffect(() => {
    setLobby({...lobby, secondsLeft: (secondsLeft)});
  }, [secondsLeft]);

  // TODO: Consider move timer into Timer component. interval re-runs this component.
  useInterval(() => {
    if (!hasStarted) return;

    if (hasPaused) return;

    if (secondsLeft === null) return null;

    if (secondsLeft <= 0 && props.lobby.state === PLAYING) return setLobby({ ...props.lobby, state: TIME_OUT });

    if (props.lobby.state === TIME_OUT) return;

    if (!gameMenuEnabled) setSecondsLeft(secondsLeft - 1);
  }, 1000);

  const penalize = () => {
    const indexLimb = getLivesLeft(props.lobby.hangedMan) - 1;

    return { ...props.lobby.hangedMan, [limbsOrder[indexLimb]]: "active" };
  };

  const onNewLetterPressed = (letter) => {
    if (getLivesLeft(props.lobby.hangedMan) === 0) return;

    const isMatched = props.lobby.settings.phrases[props.lobby.currentPhraseIndex].toUpperCase().includes(letter);

    let hangedMan = props.lobby.hangedMan;
    let state = props.lobby.state;

    // check if isMatched and if the phrase was guessed
    if (
      isMatched &&
      phraseIsGuessed(
        [...Object.keys(props.lobby.lettersPressed), letter],
        props.lobby.settings.phrases[props.lobby.currentPhraseIndex].toUpperCase().replace(/ /g, "")
      )
    )
      state = GUESSED;

    if (!isMatched) hangedMan = penalize();

    if (getLivesLeft(hangedMan) === 0) state = HANGED;

    setLobby({
      ...props.lobby,
      state,
      hangedMan,
      lettersPressed: {
        ...props.lobby.lettersPressed,
        [letter]: isMatched ? "matched" : "unmatched",
      },
    });
  };

  const isGameOver = () => isLastRound(props.lobby) && props.lobby.state !== PLAYING;

  const skipPhrase = () => {
    setLobby({
      ...props.lobby,
      state: SKIP_PHRASE,
    });
  };

  const nextRound = () => {
    if (isLastRound(props.lobby)) return;

    setSecondsLeft(props.lobby.settings.secondsPerRound);
    setHasStarted(false);

    setLobby({
      ...props.lobby,
      state: PLAYING,
      lettersPressed: {},
      startAt: new Date(),
      hangedMan: defaultHandMan,
      currentPhraseIndex: props.lobby.currentPhraseIndex + 1,
    });
  };

  const resetGame = async () => {
    setSecondsLeft(props.lobby.settings.secondsPerRound);
    setHasStarted(false);

    setLobby({
      ...props.lobby,
      state: PLAYING,
      lettersPressed: {},
      startAt: new Date(),
      currentPhraseIndex: 0,
      hangedMan: defaultHandMan,
    });
  };

  const updateGameAndRestart = (settings, phrases) => {
    setIsLoadingSave(true);

    setSecondsLeft(settings.secondsPerRound);
    if (settings.secondsPerRound) setHasPaused(true);

    setLobby({
      ...props.lobby,
      settings: { ...settings, phrases: phrases.filter((phrase) => phrase !== "") },
      state: PLAYING,
      secondsLeft: settings.secondsPerRound,
      startAt: new Date(),
    });
    setIsLoadingSave(false);
  };

  // TODO: Consider to refactoring, <Admin> & <User>.
  return (
    <InPlayContainer className="min-h-screen">

      <div className="absolute inset-4 bg-secondaryDark opacity-50"></div>

      <UserLayout {...props} />

      <GameHeader>
        <ButtonAnt color="default" className="btn-action" onClick={() => setGameMenuEnabled(true)}>
          Editar juego
        </ButtonAnt>

        <div class="timer-container inline-flex items-center">
          {secondsLeft !== null && (
            <Timer
              {...props}
              className="timer"
              secondsLeft={secondsLeft}
              roundOverMessage="Ronda terminada!"
              isRoundOver={props.lobby.state !== PLAYING}
            />
          )}

          {((hasStarted && secondsLeft !== null)) && (
            <div className="inline mx-8">
              <ButtonAnt
                color="success"
                disabled={!hasStarted}
                onClick={() => setHasPaused(!hasPaused)}
              >
                {hasPaused ? <CaretRightOutlined /> : <PauseOutlined />}
              </ButtonAnt>
            </div>
          )}
        </div>
        

        {
          !isLastRound(props.lobby)
          ? (<ButtonAnt
                color="danger"
                className="btn-action"
                onClick={() => skipPhrase()}
                disabled={isLastRound(props.lobby)}
              >
                <span className="btn-text">Saltar turno</span>
                <FastForwardOutlined />
              </ButtonAnt>)
          : (<ButtonAnt
                color="danger"
                className="btn-action"
                onClick={() => skipPhrase()}
              >
                <span className="btn-text">Finalizar juego</span>
                <FastForwardOutlined />
              </ButtonAnt>)
        }
      </GameHeader>

      <HangedGameContainer>

        <HangedMan {...props} hangedMan={props.lobby.hangedMan} />

        <div className="guess-phrase-container">
          {props.lobby.settings.phrases[props.lobby.currentPhraseIndex].split("").map((letter, i) =>
            letter === " "
            ? (<span key={`ws-${i}`} className="whitespace">&nbsp;</span>)
            : letter === ","
            ? (<span key={`ws-${i}`} className="text-white leading-6 text-6xl md:text-8xl whitespace">{ letter }</span>)
            : (
              <div key={`letter-${i}`} className="letter">
                <div className="character">
                  {Object.keys(props.lobby.lettersPressed).includes(letter.toUpperCase()) ? letter.toUpperCase() : " "}
                </div>
                <hr className="underscore" />
              </div>
            )
          )}
        </div>

        <div className={`alert text-center text-white font-bold text-xl ${isAlertOpen && 'opened'}`}>
          {alertText}
        </div>

        <Alphabet
          {...props}
          lettersPressed={props.lobby.lettersPressed}
          onLetterPressed={(letter) => {
            if (!hasStarted) {
              setHasStarted(true);
            }
            if (hasPaused) {
              setAlertText(`Debes apretar el botón Continuar para iniciar el juego.`)

              setIsAlertOpen(true)
              return setTimeout(() => { setIsAlertOpen(false) }, 3000);
            }

            onNewLetterPressed(letter)
          }}
        />

        {props.lobby.state !== PLAYING && (
          <OverlayResult
            {...props}
            gameState={props.lobby.state}
            hasGuessed={props.lobby.state === GUESSED}
            phrase={props.lobby.settings.phrases[props.lobby.currentPhraseIndex]}
            isGameOver={isGameOver()}
            onContinue={() => isLastRound(props.lobby) ? resetGame() : nextRound()}
            onResetGame={() => resetGame()}
          />
        )}
      </HangedGameContainer>

      {gameMenuEnabled && (
        <GameSettings
          {...props}
          game={props.lobby.game}
          isLoadingSave={isLoadingSave}
          settings={props.lobby.settings}
          onUpdateGame={(settings, phrases) => updateGameAndRestart(settings, phrases)}
          setGameMenuEnabled={setGameMenuEnabled}
        />
      )}
    </InPlayContainer>
  );
};

const GameHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  margin: 0.5rem;
  column-gap: 3rem;
  row-gap: 1rem;

  .timer-container {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
    justify-self: center;

    ${mediaQuery.afterTablet} {
      justify-self: start;
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
  }

  ${mediaQuery.afterTablet} {
    grid-template-columns: 1fr 600px 1fr;
    margin: 4rem auto 0 auto;
  }

  .btn-action {
    font-weight: bold;
    font-size: 16px;
    padding: 0.5rem 2rem;

    ${mediaQuery.afterTablet} {
      font-size: 16px;
    }
  }
`;

const GameActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${(props) => props.right ? 'end' : 'center'};
  margin: 0px 8px 0 8px;
  padding-bottom: 32px;

  ${mediaQuery.afterTablet} {
    max-width: 1200px;
    margin: 32px auto 0 auto;
    justify-content: ${(props) => props.right ? 'end' : 'space-between'};
  }

  .btn-text {
    vertical-align: text-top;
  }

  .btn-icon {
    font-size: 1rem;
  }

  .btn-action {
    display: inline-block;
    font-weight: bold;
    margin: 1rem;

    font-weight: bold;
    font-size: 16px;
    
    ${mediaQuery.afterTablet} {
      font-size: 18px;
    }
  }
`;

const HangedGameContainer = styled.div`
  margin: 0 12px;
  padding-top: 8px;
  position: relative;

  ${mediaQuery.afterTablet} {
    max-width: 700px;
    margin: 0 auto;
    top: 0px;
  }

  .guess-phrase-container {
    text-align: center;
    margin-bottom: 60px;

    .whitespace {
      margin: 7px;
    }

    .letter {
      color: ${(props) => props.theme.basic.white};
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      line-height: 28px;

      margin: 8px 4px;
      min-width: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      vertical-align: bottom;

      .character {
        text-transform: uppercase;
      }

      .underscore {
        width: 100%;
        height: 2px;
        background: white;
      }

      ${mediaQuery.afterTablet} {
        font-size: 35px;
        min-width: 45px;
        line-height: 47px;
      }
    }
  }
  
  .alert {
    transition: max-height 1.5s ease;
    max-height: 0;
    overflow: hidden;

    &.opened {
      max-height: 300px;
    }
  }
`;

const InPlayContainer = styled.div`
  background-image: url("${(props) => `${config.storageUrl}/resources/coral-pattern-tablet.svg`}");
`;

