import React, { useEffect, useGlobal, useState, useMemo } from "reactn";
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
import { useTranslation } from "../../../../hooks/useTranslation";
import { GameSettings } from "./GameSettings";
import { GuessPhrase } from "./GuessPhrase";
import { useInterval } from "../../../../hooks/useInterval";
import { PauseOutlined, CaretRightOutlined, FastForwardOutlined } from "@ant-design/icons";
import { defaultHandMan, GUESSED, HANGED, limbsOrder, PLAYING, TIME_OUT, SKIP_PHRASE, tildes } from "../../../../components/common/DataList";

const getLivesLeft = (hangedMan) => Object.values(hangedMan).filter((limb) => limb === "hidden").length;

const phraseIsGuessed = (letters, phrase) => every(phrase, (letter) => includes(letters, letter));

export const LobbyInPlay = (props) => {
  const { t } = useTranslation();

  const [authUser] = useGlobal("user");

  const [lobby, setLobby] = useState(props.lobby);

  const [hasStarted, setHasStarted] = useState(false);
  const [hasPaused, setHasPaused] = useState(false);

  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [gameMenuEnabled, setGameMenuEnabled] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(props.lobby.secondsLeft ?? props.lobby.settings.secondsPerRound);

  const [alertText, setAlertText] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const isLastRound = useMemo(() => lobby?.currentPhraseIndex + 1 === lobby?.settings.phrases.length, [lobby]);

  const isFirstGame = useMemo(() => lobby.currentPhraseIndex === 0, [lobby]);

  const isGameOver = useMemo(() => isLastRound && lobby?.state !== PLAYING, [lobby]) ;

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
    if (hasStarted || !isFirstGame) return;

    setIsAlertOpen(true);
    setAlertText("Haz click en una letra para empezar");
  }, [hasStarted, lobby]);

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

  const hasMatch = (phrase, letter_) =>  {
    const letter = letter_.toUpperCase();
    const tildeChar = tildes[letter]?.toUpperCase();

    const isMatch = phrase.toUpperCase().includes(letter);
    if (isMatch) return [tildeChar
      ? [letter, tildeChar]
      : [letter], true];

    return tildeChar
      ? [[letter, tildeChar], phrase.toUpperCase().includes(tildeChar)]
      : [[letter], false];
  }

  const onNewLetterPressed = (letter) => {
    if (!hasStarted) setHasStarted(true);

    if (!hasStarted && isAlertOpen) setIsAlertOpen(false);

    if (hasPaused) {
      setAlertText(`Debes apretar el botón "Play" para iniciar el juego.`);

      setIsAlertOpen(true);
      return setTimeout(() => { setIsAlertOpen(false) }, 3000);
    }

    if (getLivesLeft(props.lobby.hangedMan) === 0) return;

    const [ lettersMatched, isMatched ] = hasMatch(props.lobby.settings.phrases[props.lobby.currentPhraseIndex], letter);

    let hangedMan = props.lobby.hangedMan;
    let state = props.lobby.state;

    // check if isMatched and if the phrase was guessed
    if (
      isMatched &&
      phraseIsGuessed(
        [...Object.keys(props.lobby.lettersPressed), ...lettersMatched],
        props.lobby.settings.phrases[props.lobby.currentPhraseIndex].toUpperCase().replace(/ /g, "")
      )
    )
      state = GUESSED;

    if (!isMatched) hangedMan = penalize();

    if (getLivesLeft(hangedMan) === 0) state = HANGED;

    const letterPressedUpdate = lettersMatched.reduce(
      (acc, char) => ({ [char]: isMatched ? "matched" : "unmatched" , ...acc }),
      {});

    setLobby({
      ...props.lobby,
      state,
      hangedMan,
      lettersPressed: {
        ...props.lobby.lettersPressed,
        ...letterPressedUpdate,
      },
    });
  };

  const skipPhrase = () => setLobby({ ...props.lobby, state: SKIP_PHRASE });

  const nextRound = () => {
    if (isLastRound) return;

    setSecondsLeft(props.lobby.settings.secondsPerRound);
    setHasStarted(false);
    setHasPaused(false);

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
    setHasPaused(false);

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

      <div className="min-h-[calc(100vh-100px)] screen flex flex-col justify-evenly">
        <GameHeader>
          <ButtonAnt color="default" className="btn-action" onClick={() => setGameMenuEnabled(true)}>
            {t("pages.lobby.in-game.edit-game")}
          </ButtonAnt>

          <div className="timer-container inline-flex items-center">
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
            !isLastRound
            ? (<ButtonAnt
                  color="danger"
                  className="btn-action"
                  onClick={() => skipPhrase()}
                  disabled={isLastRound}
                >
                  <span className="btn-text">{t("pages.lobby.in-game.jump-phrase")}</span>
                  <FastForwardOutlined />
                </ButtonAnt>)
            : (<ButtonAnt
                  color="danger"
                  className="btn-action"
                  onClick={() => skipPhrase()}
                >
                  <span className="btn-text">{t("pages.lobby.in-game.finish-game")}</span>
                  <FastForwardOutlined />
                </ButtonAnt>)
          }
        </GameHeader>

        <HangedMan {...props} hangedMan={props.lobby.hangedMan}/>

        <GuessPhrase {...props} phrase={props.lobby.settings.phrases[props.lobby.currentPhraseIndex]} />

        <div className="max-w-[700px] mx-auto pb-8 relative">
          <div className={`alert text-center text-white font-bold text-xl ${isAlertOpen && 'opened'}`}>
            {alertText}
          </div>

          <Alphabet
            {...props}
            lettersPressed={props.lobby.lettersPressed}
            onLetterPressed={(letter) => onNewLetterPressed(letter)}
          />
        </div>

        {props.lobby.state !== PLAYING && (
          <OverlayResult
            {...props}
            gameState={props.lobby.state}
            hasGuessed={props.lobby.state === GUESSED}
            phrase={props.lobby.settings.phrases[props.lobby.currentPhraseIndex]}
            isGameOver={isGameOver}
            onContinue={() => isLastRound ? resetGame() : nextRound()}
            onResetGame={() => resetGame()}
          />
        )}

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
      </div>
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

  ${mediaQuery.afterTablet} {
    grid-template-columns: 1fr 600px 1fr;
    margin: 0 auto;
    padding-top: 2rem;
  }

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

  .btn-action {
    font-weight: bold;
    font-size: 16px;
    padding: 0.5rem 2rem;

    ${mediaQuery.afterTablet} {
      font-size: 16px;
    }
  }
`;

const InPlayContainer = styled.div`
  background-image: url("${(props) => `${config.storageUrl}/resources/coral-pattern-tablet.svg`}");

  .alert {
    transition: max-height 1.5s ease;
    max-height: 0;
    overflow: hidden;

    &.opened {
      max-height: 300px;
    }
  }
`;

