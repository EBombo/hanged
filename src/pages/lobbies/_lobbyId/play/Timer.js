import React from "reactn";
import styled from "styled-components";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";

export const Timer = (props) => (
  <TimerContainer>
    <div className="timer">
      <Image 
        src={`${config.storageUrl}/resources/timer.png`}
        Desktopwidth="56px"
        width="32px"
      />
    </div>
    <div className="label">{props.secondsLeft ?? 0} segundos</div>
  </TimerContainer>
);

const TimerContainer = styled.div`
  display: inline-block;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;

  display: flex;
  align-items: center;
  color: ${(props) => props.theme.basic.whiteLight};

  .label {
    margin-left: 14px;
  }
`;

