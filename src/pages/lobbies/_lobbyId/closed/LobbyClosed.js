import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import styled, { keyframes } from "styled-components";
import { timeoutPromise } from "../../../../utils/promised";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { Winner } from "./Winner";
import { ButtonAnt, ButtonBingo } from "../../../../components/form";
import {
  fadeInLeftBig,
  fadeInRightBig,
  fadeInUp,
  fadeOutLeftBig,
  fadeOutRightBig,
  fadeOutUpBig,
} from "react-animations";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";

export const LobbyClosed = (props) => {
  const [authUser] = useGlobal("user");

  const [isVisibleTitle, setIsVisibleTitle] = useState(true);
  const [isVisibleTitleAnimation, setIsVisibleTitleAnimation] = useState(false);

  const [showResume, setShowResume] = useState(false);
  const [showResumeAnimation, setShowResumeAnimation] = useState(false);

  const [showWinners, setShowWinners] = useState(false);
  const [showWinnersAnimation, setShowWinnersAnimation] = useState(false);

  useEffect(() => {
    const initializeAnimation = async () => {
      await timeoutPromise(2 * 1000);
      setIsVisibleTitleAnimation(true);
      await timeoutPromise(2 * 1000);
      setIsVisibleTitle(false);
    };

    initializeAnimation();
  }, []);

  const initializeTransitionToResume = async () => {
    setShowResumeAnimation(true);
    await timeoutPromise(1000);
    setShowResume(true);
    setShowResumeAnimation(false);
  };

  const initializeTransitionToWinners = async () => {
    setShowResumeAnimation(true);
    await timeoutPromise(1000);
    setShowResume(false);
    setShowResumeAnimation(false);
  };

  const initializeTransitionToListWinners = async () => {
    setShowWinnersAnimation(true);
    await timeoutPromise(1000);
    setShowWinners(true);
    setShowWinnersAnimation(false);
  };

  const itemAttendees = useMemo(
    () => (
      <div className="item flex">
        <div className="metric">
          <Image src={`${config.storageUrl}/resources/attendees.png`} width="55px" desktopWidth="75px" />
          <div>
            <div className="number">{Object.keys(props.lobby.users)?.length ?? 0}</div>
            <div className="label">asistentes</div>
          </div>
        </div>
      </div>
    ),
    [props.lobby.users]
  );

  const itemPlayAgain = useMemo(
    () => (
      <div className="item flex">
        <div className="content-center">
          ¿Se divirtieron?
          <ButtonAnt
            variant="contained"
            color="success"
            margin="auto"
            onClick={() => {
              const userId = authUser.id;
              const redirectUrl = `${window.location.origin}/games/${props.lobby.game.id}?userId=${userId}`;
              window.open(redirectUrl, "blank");
            }}
          >
            Jugar de nuevo
          </ButtonAnt>
        </div>
      </div>
    ),
    [authUser.id]
  );

  const itemMessages = useMemo(
    () => (
      <div className="item flex">
        <div className="metric">
          <Image src={`${config.storageUrl}/resources/messages.png`} width="55px" desktopWidth="75px" />
          <div>
            <div className="number">{props.lobby.totalMessages ?? 0}</div>
            <div className="label">mensages</div>
          </div>
        </div>
      </div>
    ),
    [props.lobby.totalMessages]
  );

  const itemOptions = useMemo(
    () => (
      <div className="item">
        <ButtonAnt
          variant="contained"
          color="primary"
          margin="20px auto"
          width="80%"
          onClick={initializeTransitionToListWinners}
        >
          Ver reporte completo
        </ButtonAnt>
        <ButtonAnt
          variant="contained"
          color="primary"
          margin="20px auto"
          width="80%"
          onClick={initializeTransitionToWinners}
        >
          Volver al inicio
        </ButtonAnt>
      </div>
    ),
    []
  );

  if (showWinners)
    return (
      <LobbyWinnersCss>
        <div className="anchor-link" onClick={() => setShowWinners(false)}>
          Volver al podio
        </div>
        <div className="list">
          {props.lobby.winners.map((winner, index) => (
            <Winner winner={winner} index={index} key={index} isList />
          ))}
        </div>
      </LobbyWinnersCss>
    );

  return showResume ? (
    <LobbyResumeCss showResumeAnimation={showResumeAnimation} showWinnersAnimation={showWinnersAnimation}>
      <div className="resume">
        <div className="item">
          <Image
            src={`${config.storageUrl}/resources/coap.png`}
            desktopHeight="80%"
            height="200px"
            margin="-15% auto 15px auto"
            size="contain"
          />
          <ButtonAnt
            variant="contained"
            color="primary"
            margin="auto auto 15px auto"
            onClick={initializeTransitionToWinners}
          >
            Volver al podio
          </ButtonAnt>
        </div>
        <div className="child">
          <Desktop>
            {itemAttendees}
            {itemPlayAgain}
            {itemMessages}
            {itemOptions}
          </Desktop>
          <Tablet>
            <div className="metric-child">
              {itemAttendees}
              {itemMessages}
            </div>
            {itemPlayAgain}
            {itemOptions}
          </Tablet>
        </div>
      </div>
    </LobbyResumeCss>
  ) : (
    <LobbyClosedCss
      isVisibleTitleAnimation={isVisibleTitleAnimation}
      showResumeAnimation={showResumeAnimation}
      showWinnersAnimation={showWinnersAnimation}
    >
      <div className="header">
        {!isVisibleTitle && (
          <ButtonBingo variant="primary" margin="10px 10px auto auto" onClick={initializeTransitionToResume}>
            Siguiente
          </ButtonBingo>
        )}
      </div>

      {isVisibleTitle && <div className="title">{props.lobby.game.title}</div>}

      {!isVisibleTitle && (
        <div className="winners">
          {props.lobby.winners.slice(0, 3).map((winner, index) => (
            <Winner winner={winner} index={index} key={index} />
          ))}
        </div>
      )}
      {!isVisibleTitle && (
        <div className="footer">
          <div className="anchor-link" onClick={initializeTransitionToListWinners}>
            Ver todas las posiciones
          </div>
        </div>
      )}
    </LobbyClosedCss>
  );
};

const fadeInUpAnimation = keyframes`${fadeInUp}`;
const fadeInRightBigAnimation = keyframes`${fadeInRightBig}`;
const fadeInLeftBigAnimation = keyframes`${fadeInLeftBig}`;

const fadeOutUpBigAnimation = keyframes`${fadeOutUpBig}`;
const fadeOutLeftBigAnimation = keyframes`${fadeOutLeftBig}`;
const fadeOutRightBigAnimation = keyframes`${fadeOutRightBig}`;

const LobbyClosedCss = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 6fr 1fr;

  .header {
    display: flex;
  }

  .title {
    margin: auto;
    background: ${(props) => props.theme.basic.white};
    font-size: 1.5rem;
    padding: 10px 10px;
    border-radius: 5px;
    animation: 2s ${(props) => (props.isVisibleTitleAnimation ? fadeOutUpBigAnimation : "")};
  }

  .winners {
    width: 90%;
    margin: auto;
    animation: 2s ${(props) => (props.showResumeAnimation ? fadeOutLeftBigAnimation : fadeInLeftBigAnimation)};

    ${mediaQuery.afterTablet} {
      width: 70vw;
    }
  }

  .footer {
    display: flex;
    animation: 2s ${fadeInUpAnimation};

    .anchor-link {
      margin: auto;
      cursor: pointer;
      font-size: 2rem;
      font-weight: bold;
      color: ${(props) => props.theme.basic.white};
    }
  }
`;

const LobbyResumeCss = styled.div`
  display: flex;
  height: 100vh;
  text-align: center;

  .flex {
    display: flex;
  }

  .item {
    border-radius: 10px;
    background: ${(props) => props.theme.basic.white};

    .content-center {
      margin: auto;
    }
  }

  .resume {
    width: auto;
    margin: 50px 15px;
    display: grid;
    grid-gap: 20px;
    animation: 1s ${(props) => (props.showResumeAnimation ? fadeOutRightBigAnimation : fadeInRightBigAnimation)};

    ${mediaQuery.afterTablet} {
      width: 70%;
      height: 300px;
      margin: auto;
      grid-template-columns: 1.5fr 3fr;
    }

    .child {
      display: grid;
      grid-gap: 20px;
      grid-template-rows: 1fr 1fr 1.3fr;

      .metric-child {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 1fr 1fr;
      }

      ${mediaQuery.afterTablet} {
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1.3fr 1fr;
      }

      .metric {
        margin: auto 5%;
        display: grid;
        text-align: left;
        grid-template-columns: 1.5fr 1fr;
        color: ${(props) => props.theme.basic.secondary};

        .number {
          font-size: 1.7rem;
        }

        .label {
          font-size: 1rem;
        }
      }
    }
  }
`;

const LobbyWinnersCss = styled.div`
  display: flex;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 6fr;

  .list {
    width: 90%;
    margin: auto;
    animation: 2s ${(props) => (props.showResumeAnimation ? fadeOutLeftBigAnimation : fadeInLeftBigAnimation)};

    ${mediaQuery.afterTablet} {
      width: 70vw;
    }
  }

  .anchor-link {
    margin: auto;
    cursor: pointer;
    font-size: 2rem;
    font-weight: bold;
    color: ${(props) => props.theme.basic.white};
  }
`;
