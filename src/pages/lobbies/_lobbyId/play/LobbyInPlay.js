import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import every from "lodash/every";
import includes from "lodash/includes";
import { mediaQuery } from "../../../../constants";
import { UserLayout } from "../userLayout";
import { firestore } from "../../../../firebase";
import { HangedMan } from "./HangedMan";
import { Timer } from "./Timer";
import { Alphabet } from "./Alphabet";
import { OverlayResult } from "./OverlayResult";
import { ButtonAnt } from "../../../../components/form";
import { GameSettings } from "./GameSettings";
import { useInterval } from "../../../../hooks/useInterval";
import { defaultHandMan, GUESSED, HANGED, limbsOrder, PLAYING, TIME_OUT } from "../../../../components/common/DataList";
import moment from "moment";

const getDeltaTime = (startAt) => {
  const diffTime = moment(startAt).diff(moment(), "seconds");
  return Math.abs(diffTime);
};

const isLastRound = (lobby) => lobby.currentPhraseIndex + 1 === lobby.settings.phrases.length;

const getLivesLeft = (hangedMan) => Object.values(hangedMan).filter((limb) => limb === "hidden").length;

const phraseIsGuessed = (letters, phrase) => every(phrase, (letter) => includes(letters, letter));

export const LobbyInPlay = (props) => {
  const [authUser] = useGlobal("user");

  const [lobby, setLobby] = useState(props.lobby);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [gameMenuEnabled, setGameMenuEnabled] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    props.lobby.settings.secondsPerRound - getDeltaTime(props.lobby.startAt.toDate())
  );

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

  // TODO: Consider move timer into Timer component. interval re-runs this component.
  useInterval(() => {
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

  const nextRound = () => {
    if (isLastRound(props.lobby)) return;

    setSecondsLeft(props.lobby.settings.secondsPerRound);

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

    setLobby({
      ...props.lobby,
      settings: { ...settings, phrases: phrases.filter((phrase) => phrase !== "") },
      state: PLAYING,
      startAt: new Date(),
    });
    setIsLoadingSave(false);
  };

  // TODO: Consider to refactoring, <Admin> & <User>.
  return (
    <>
      <UserLayout {...props} />

      <HangedGameContainer>
        <Timer
          {...props}
          className="timer"
          secondsLeft={secondsLeft}
          roundOverMessage="Ronda terminada!"
          isRoundOver={props.lobby.state !== PLAYING}
        />

        <HangedMan {...props} hangedMan={props.lobby.hangedMan} />

        <div className="guess-phrase-container">
          {props.lobby.settings.phrases[props.lobby.currentPhraseIndex].split("").map((letter, i) =>
            letter === " " ? (
              <span key={`ws-${i}`} className="whitespace">
                &nbsp;
              </span>
            ) : (
              <div key={`letter-${i}`} className="letter">
                <div className="character">
                  {Object.keys(props.lobby.lettersPressed).includes(letter.toUpperCase()) ? letter.toUpperCase() : " "}
                </div>
                <hr className="underscore" />
              </div>
            )
          )}
        </div>

        <Alphabet
          {...props}
          lettersPressed={props.lobby.lettersPressed}
          onLetterPressed={(letter) => onNewLetterPressed(letter)}
        />

        {props.lobby.state !== PLAYING && (
          <OverlayResult
            {...props}
            hasGuessed={props.lobby.state === GUESSED}
            phrase={props.lobby.settings.phrases[props.lobby.currentPhraseIndex]}
            isGameOver={isGameOver()}
            onContinue={() => nextRound()}
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

      <GameActions>
        <ButtonAnt color="default" className="btn-action" onClick={() => setGameMenuEnabled(true)}>
          Editar juego
        </ButtonAnt>
        <ButtonAnt
          color="danger"
          className="btn-action"
          onClick={() => nextRound()}
          disabled={isLastRound(props.lobby)}
        >
          Saltar turno
        </ButtonAnt>
      </GameActions>
    </>
  );
};

const GameActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 32px 8px 0 8px;
  padding-bottom: 32px;

  ${mediaQuery.afterTablet} {
    max-width: 1200px;
    margin: 32px auto 0 auto;
  }

  .btn-action {
    display: inline-block;
    font-weight: bold;
  }
`;

const HangedGameContainer = styled.div`
  margin: 0 12px;
  padding-top: 8px;

  ${mediaQuery.afterTablet} {
    max-width: 700px;
    margin: 0 auto;
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
      }
    }
  }
`;
