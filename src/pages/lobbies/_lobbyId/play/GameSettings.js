import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { GameMenu } from "../../../../components/GameMenu";

export const GameSettings = (props) => {
  const [audios] = useGlobal("audios");

  const [settings, setSettings] = useState(props.settings);

  return (
    <GameSettingsContainer>
      <GameMenu
        {...props}
        audios={audios}
        isLoadingSave={props.isLoadingSave}
        onAudioChange={(audioId) => setSettings({ ...settings, audio: { id: audioId } })}
        onSecondsPerRoundChange={(seconds) => setSettings({ ...settings, secondsPerRound: seconds })}
        addNewPhrase={(newPhrase) => setSettings({ ...settings, phrases: [...settings.phrases, newPhrase] })}
        onUpdateGame={(phrases) => {
          props.onUpdateGame(settings, phrases);
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
