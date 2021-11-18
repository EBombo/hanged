import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import defaultTo from "lodash/defaultTo";
import { UserLayout } from "../userLayout";
import { firestore } from "../../../../firebase";
import { HangedMan } from "./HangedMan";
import { Timer } from "./Timer";
import { Alphabet } from "./Alphabet";
import { OverlayResult } from "./OverlayResult";
import { ButtonAnt } from "../../../../components/form";
import { GameSettings } from "./GameSettings";
import { useInterval } from "../../../../hooks/useInterval";

const orderLimbs = ["head", "leftLeg", "rightLeg", "leftArm", "rightArm", "trunk"];
const defaultHandMan = {
  head: 'hidden',
  leftLeg: 'hidden',
  rightLeg: 'hidden',
  leftArm: 'hidden',
  rightArm: 'hidden',
  trunk: 'hidden',
};

export const LobbyInPlay = (props) => {
  const [authUser] = useGlobal("user");
  const [user, setUser] = useState(null);
  const [game, setGame] = useState({
    ...props.lobby.game,
    hangedMan: { ...defaultHandMan },
    lettersPressed: {},
    lives: orderLimbs.length,
  });
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(-1);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [gameMenuEnabled, setGameMenuEnabled] = useState(false);

  useEffect(() => {
    const currentUserId = authUser.id;
    if (props.lobby?.users?.[currentUserId] || props.lobby.game.usersIds.includes(currentUserId)) return;

    props.logout();
  }, [props.lobby.users]);

  // TODO: consider refactor time interval
  const timeCountdown = () => {
      if (secondsLeft === 0 || isRoundOver) {
        setIsRoundOver(true);
        return;
      }
      setSecondsLeft(secondsLeft - 1);
  };
  useInterval(timeCountdown, 1000);
  useEffect(() => {
    setSecondsLeft(props.lobby.game.secondsPerRound);
  }, [currentPhraseIndex]);

  const onNewLetterPressed = (letter) => {
    if (game.lives === 0) return;

    const isMatched = game.phrases[currentPhraseIndex].toUpperCase().includes(letter);
    let livesLeft = game.lives;
    let hangedMan = game.hangedMan;
    if (!isMatched) {
      ({ livesLeft, hangedMan } = penalize());
    }
    if (game.phrases[currentPhraseIndex].split('').filter((letter) => Object.keys(game.lettersPressed).includes(letter)).length === game.phrases[currentPhraseIndex].length) {
      setHasGuessed(true);
      setIsRoundOver(true);
    }
    
    setGame({
      ...game,
      lives: livesLeft,
      hangedMan: hangedMan,
      lettersPressed: { 
        ...game.lettersPressed,
        [letter]: isMatched ? "matched" : "unmatched",
      }
    });
  };

  const penalize = () => {
    const indexLimb = game.lives - 1;
    const livesLeft = game.lives - 1;
    if (livesLeft === 0) setIsRoundOver(true);
    const hangedManUpdated = {...game.hangedMan, [orderLimbs[indexLimb]]: "active"};

    return { livesLeft, hangedMan: hangedManUpdated};
  };

  const nextRound = () => {
    setCurrentPhraseIndex((prev) => prev + 1);
    resetRound();
  };

  const resetRound = () => {
    setIsRoundOver(false);
    setHasGuessed(false);
    setGame({
      ...game,
      lettersPressed: {},
      hangedMan: { ...defaultHandMan },
      lives: orderLimbs.length
    });
  };

  const resetGame = () => {
    setCurrentPhraseIndex(0);
    resetRound();
  };

  const isGameOver = () => {
    return (game.phrases.length <= (currentPhraseIndex + 1));
  };

  const updateGameAndRestart = async (updatedGame) => {
    resetGame();
    setGame({...updatedGame});
  };

  // TODO: Consider to refactoring, <Admin> & <User>.
  return (
    <>
      <UserLayout {...props} />

      <HangedGameContainer>
        <Timer 
          className="timer" {...props}
          secondsLeft={secondsLeft}
          isRoundOver={isRoundOver}
          roundOverMessage="Ronda terminada!"
        />
        <HangedMan {...props} hangedMan={game.hangedMan}/>
        <div className="guess-phrase-container">
          {game.phrases[currentPhraseIndex].split('').map(
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
        { isRoundOver &&
          (<OverlayResult
            {...props}
            hasGuessed={hasGuessed}
            phrase={game.phrases[currentPhraseIndex]}
            isGameOver={isGameOver()}
            onContinue={() => nextRound()}
            onResetGame={() => resetGame()}
          />
        )}
        
      </HangedGameContainer>
      { gameMenuEnabled && (<GameSettings {...props} game={game} onUpdateGame={(updatedGame) => updateGameAndRestart(updatedGame)} setGameMenuEnabled={setGameMenuEnabled}/>) }
      <GameActions>
        <ButtonAnt color="default" className="btn-action" onClick={() => setGameMenuEnabled(true)}>Editar juego</ButtonAnt>
        <ButtonAnt color="danger" className="btn-action" onClick={() => nextRound()} disabled={isGameOver()}>Saltar turno</ButtonAnt>
      </GameActions>
    </>
  );
};


const GameActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 32px 8px 0 8px;
  padding-bottom: 32px;

  .btn-action {
    display: inline-block;
    font-weight: bold;
  }
`;

const HangedGameContainer = styled.div`
  margin: 0 12px;
  padding-top: 8px;

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
