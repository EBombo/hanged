import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import every from "lodash/every";
import includes from "lodash/includes";
import { mediaQuery } from "../../../../constants";
import { UserLayout } from "../userLayout";
import { firestore } from "../../../../firebase";
import firebase from "firebase"
import { HangedMan } from "./HangedMan";
import { Timer } from "./Timer";
import { Alphabet } from "./Alphabet";
import { OverlayResult } from "./OverlayResult";
import { ButtonAnt } from "../../../../components/form";
import { GameSettings } from "./GameSettings";
import { useInterval } from "../../../../hooks/useInterval";
import { limbsOrder, defaultHandMan, PLAYING, TIME_OUT, HANGED, GUESSED } from "../../../../components/common/DataList";
import moment from "moment"

const getDeltaTime = (dateTime, now) => {
  if (!dateTime) return 0;
  if (dateTime instanceof firebase.firestore.Timestamp) return Math.abs(moment(dateTime.toDate()).diff(moment(now), "seconds"))
  return Math.abs(moment(dateTime).diff(moment(now), "seconds"))
};
const isLastRound = (game) => (game.currentPhraseIndex + 1) === game.phrases.length;
const getLivesLeft = (hangedMan) => Object.values(hangedMan).filter(limb => limb === "hidden").length;
const phraseIsGuessed = (letters, phrase) => every(phrase, (letter) => includes(letters, letter));

export const LobbyInPlay = (props) => {
  const [authUser] = useGlobal("user");

  const [user, setUser] = useState(null);
  const [game, setGame] = useState({ ...props.lobby.game });
  const [secondsLeft, setSecondsLeft] = useState(game.secondsPerRound - getDeltaTime(game.roundStartedAt, new Date()));
  const [gameMenuEnabled, setGameMenuEnabled] = useState(false);

  useEffect(() => {
    const currentUserId = authUser.id;
    if (props.lobby?.users?.[currentUserId] || props.lobby.game.usersIds.includes(currentUserId)) return;

    props.logout();
  }, [props.lobby.users]);

  useEffect(async () => await saveGameState({ ...game }), [game]);

  // TODO: consider move timer into Timer component. interval re-runs this component
  const timeCountdown = () => {
    if (secondsLeft <= 0 && game.state === PLAYING) return setGame({ ...game, state: TIME_OUT});
    if (game.state === TIME_OUT) return
    if (!gameMenuEnabled) setSecondsLeft(secondsLeft - 1);
  };

  useInterval(timeCountdown, 1000);

  const onNewLetterPressed = (letter) => {
    if (getLivesLeft(game.hangedMan) === 0) return;

    const isMatched = game.phrases[game.currentPhraseIndex].toUpperCase().includes(letter);

    let hangedMan = game.hangedMan;
    let state = game.state;

    // check if isMatched and if the phrase was guessed
    if (isMatched && phraseIsGuessed([ ...Object.keys(game.lettersPressed), letter ], game.phrases[game.currentPhraseIndex].toUpperCase().replace(/ /g,'')))
      state = GUESSED;

    if (!isMatched) ({ hangedMan } = penalize());

    if (getLivesLeft(hangedMan) === 0) state = HANGED;

    setGame({
      ...game,
      state, 
      hangedMan: hangedMan,
      lettersPressed: { 
        ...game.lettersPressed,
        [letter]: isMatched ? "matched" : "unmatched",
      }
    });
  };

  const isGameOver = () => (isLastRound(game) && game.state !== PLAYING);

  const penalize = () => {
    const indexLimb = getLivesLeft(game.hangedMan) - 1;

    const hangedManUpdated = {...game.hangedMan, [limbsOrder[indexLimb]]: "active"};

    return { hangedMan: hangedManUpdated};
  };

  const nextRound = () => {
    if (isLastRound(game)) return;

    setSecondsLeft(game.secondsPerRound);
    setGame({
      ...game,
      roundStartedAt: new Date(),
      lettersPressed: {},
      hangedMan: { ...defaultHandMan },
      state: PLAYING,
      currentPhraseIndex: game.currentPhraseIndex + 1,
    });
  };

  const resetGame = async () => {
    setSecondsLeft(game.secondsPerRound);
    setGame({
      ...game,
      roundStartedAt: new Date(),
      lettersPressed: {},
      hangedMan: { ...defaultHandMan },
      state: PLAYING,
      currentPhraseIndex: 0,
    });
  };

  const updateGameAndRestart = (updatedGame) => {
    setSecondsLeft(updatedGame.secondsPerRound);
    setGame({
      ...updatedGame,
      roundStartedAt: new Date(),
      lettersPressed: {},
      hangedMan: { ...defaultHandMan },
      state: PLAYING,
      currentPhraseIndex: 0,
    });
  };

  const saveGameState = async (game) => await firestore.doc(`lobbies/${props.lobby.id}`).update({
    game,
    updateAt: new Date(),
  });

  // TODO: Consider to refactoring, <Admin> & <User>.
  return (
    <>
      <UserLayout {...props} />
      <HangedGameContainer>
        <Timer 
          className="timer" {...props}
          secondsLeft={secondsLeft}
          isRoundOver={game.state !== PLAYING}
          roundOverMessage="Ronda terminada!"
        />
        <HangedMan {...props} hangedMan={game.hangedMan}/>
        <div className="guess-phrase-container">
          {game.phrases[game.currentPhraseIndex].split('').map(
            (letter, i) => 
              letter === " "
                ? <span key={`ws-${i}`} className="whitespace">&nbsp;</span>
                : <div key={`letter-${i}`} className="letter">
                    <div className="character">{Object.keys(game.lettersPressed).includes(letter.toUpperCase()) ? letter.toUpperCase() : " "}</div>
                    <hr className="underscore"/>
                  </div>
          )}
        </div>
        <Alphabet
          {...props}
          lettersPressed={game.lettersPressed}
          onLetterPressed={(letter) => onNewLetterPressed(letter)}
        />
        { game.state !== PLAYING &&
          (<OverlayResult
            {...props}
            hasGuessed={game.state === GUESSED}
            phrase={game.phrases[game.currentPhraseIndex]}
            isGameOver={isGameOver()}
            onContinue={() => nextRound()}
            onResetGame={() => resetGame()}
          />
        )}
        
      </HangedGameContainer>
      { gameMenuEnabled && (<GameSettings {...props} game={game} onUpdateGame={(updatedGame) => updateGameAndRestart(updatedGame)} setGameMenuEnabled={setGameMenuEnabled}/>) }
      <GameActions>
        <ButtonAnt color="default" className="btn-action" onClick={() => setGameMenuEnabled(true)}>Editar juego</ButtonAnt>
        <ButtonAnt color="danger" className="btn-action" onClick={() => nextRound()} disabled={isLastRound(game)}>Saltar turno</ButtonAnt>
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
