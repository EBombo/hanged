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
import { GameMenu } from "../../../../components/GameMenu";
import { useInterval } from "../../../../hooks/useInterval";

export const GameSettings = (props) => {
  const [audios] = useGlobal("audios");
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  let modifiedGame = { ...props.game }; 

 return (
  <GameSettingsContainer>
    <GameMenu {...props}
      showChooseGameMode={false}
      game={modifiedGame}
      audios={audios}
      isLoadingSave={isLoadingSave}
      addNewPhrase={(newPhrase) => modifiedGame.phrases.push(newPhrase)}
      onAudioChange={(audioId) => {
        modifiedGame.audio = { id: audioId };
      }}
      onSecondsPerRoundChange={(seconds) => {
        modifiedGame.secondsPerRound = seconds;
      }}
      onUpdateGame={() => {
        props.onUpdateGame(modifiedGame);
        props.setGameMenuEnabled(false);
      }}
    />
  </GameSettingsContainer>
 );
};

const GameSettingsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: ${(props) => props.theme.basic.secondaryWithTransparency};
`;
