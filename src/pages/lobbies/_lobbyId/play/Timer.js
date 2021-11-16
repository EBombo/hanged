import React from "reactn";
import styled from "styled-components";

export const Timer = (props) => (
  <TimerContainer>
    <div className="timer"></div>
    <div className="label">{props.secondsLeft ?? 0} segundos</div>
  </TimerContainer>
);

const TimerContainer = styled.div`
  display: inline-block;
`;

