import React from "reactn";
import styled from "styled-components";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { useTranslation } from "../../../../hooks/useTranslation";

export const Timer = (props) => {
  const { t } = useTranslation();

  return (
    <TimerContainer>
      <div className="timer">
        <Image src={`${config.storageUrl}/resources/timer.png`} Desktopwidth="56px" width="36px" />
      </div>
      <div className="label">
        {props.isRoundOver ? props.roundOverMessage : `${props.secondsLeft} ${t("pages.lobby.in-game.seconds")}`}
      </div>
    </TimerContainer>
  );
};

const TimerContainer = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 17px;
  position: relative;

  display: flex;
  align-items: center;
  color: ${(props) => props.theme.basic.whiteLight};

  .label {
    margin-left: 14px;
  }
`;
