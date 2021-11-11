import React, { useGlobal, useState } from "reactn";
import { CardPattern } from "./CardPattern";
import { BingoBoard } from "./BingoBoard";
import { LastBall } from "./LastBall";
import { LastPlays } from "./LastPlays";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { Chat } from "../../../../components/chat";
import { SliderControls } from "./SliderControls";
import { ButtonAnt } from "../../../../components/form";
import { mapKeys } from "lodash/object";
import { firestore } from "../../../../firebase";
import { timeoutPromise } from "../../../../utils/promised";
import { createBoard } from "../../../../business";
import { useInterval } from "../../../../hooks/useInterval";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import styled from "styled-components";
import { ModalPattern } from "./ModalPattern";
import { darkTheme } from "../../../../theme";

export const AdminPanel = (props) => {
  const [isVisibleModalPattern, setIsVisibleModalPattern] = useState(false);
  const [apagon, setApagon] = useState(false);

  const [reproductionSpeed] = useGlobal("reproductionSpeed");
  const [animationSpeed] = useGlobal("animationSpeed");
  const [isAutomatic, setIsAutomatic] = useGlobal("isAutomatic");
  const [loading, setLoading] = useState(false);
  const [isLoadingCalledNumber, setIsLoadingCalledNumber] = useState(false);
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);
  const [lastNumber, setLastNumber] = useState(0);

  const startGame = async (callback) => {
    if (!props.lobby.pattern) {
      setIsVisibleModalPattern(true);
    }

    setLoading(true);

    const board = createBoard();

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      round: 0,
      lastPlays: [],
      startGame: new Date(),
      updateAt: new Date(),
      board,
    });

    setLoading(false);
    callback && callback(false);
  };

  const callNumber = async () => {
    if (!props.lobby || !props.lobby.board) return;

    setIsLoadingCalledNumber(true);

    const newBoard = { ...props.lobby.board };
    const missingNumbers = [];

    mapKeys(newBoard, (value, key) => {
      if (!value) missingNumbers.push(key);
    });

    const randomIndex = Math.floor(Math.random() * missingNumbers.length);

    const numberCalled = missingNumbers[randomIndex];

    // Prevent undefined number.
    if (!numberCalled) setIsLoadingCalledNumber(false);

    newBoard[numberCalled] = true;

    const newLastPlays = props.lobby.lastPlays;

    newLastPlays.unshift(numberCalled);

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      updateAt: new Date(),
      round: +props.lobby.round + 1,
      lastPlays: newLastPlays,
      board: newBoard,
    });

    await timeoutPromise(animationSpeed * 1000);
    setIsLoadingCalledNumber(false);
  };

  useInterval(
    callNumber,
    // Prevent auto play.
    isAutomatic && !props.lobby.bingo && !props.isVisibleModalFinal ? (reproductionSpeed + animationSpeed) * 1000 : null
  );

  const modalConfirm = () => (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      closable={false}
      padding="1rem"
      width="440px"
      topDesktop="30%"
      visible={isVisibleModalConfirm}
    >
      <ContentModal>
        <div className="title">¿Seguro que quieres reiniciar el tablero?</div>
        <div className="description">Si lo reinicias, no podrás deshacerlo.</div>
        <div className="btns-container">
          <ButtonAnt color="default" disabled={loading} onClick={() => setIsVisibleModalConfirm(false)}>
            Cancelar
          </ButtonAnt>
          <ButtonAnt color="danger" loading={loading} onClick={() => startGame(setIsVisibleModalConfirm)}>
            Reiniciar
          </ButtonAnt>
        </div>
      </ContentModal>
    </ModalContainer>
  );

  const modalPattern = () => (
    <ModalPattern
      apagon={apagon}
      setApagon={setApagon}
      isVisibleModalPattern={isVisibleModalPattern}
      setIsVisibleModalPattern={setIsVisibleModalPattern}
      continueGame={() => setIsVisibleModalPattern(false)}
      {...props}
    />
  );

  return (
    <>
      {modalConfirm()}
      {isVisibleModalPattern && modalPattern()}
      <Desktop>
        <div className="bingo">
          <div className="left-container">
            <div className="card-pattern-container">
              <CardPattern
                key={props.lobby.pattern}
                caption={"Patrón que se debe llenar"}
                apagon={apagon}
                setApagon={setApagon}
                isVisibleModalPattern={isVisibleModalPattern}
                setIsVisibleModalPattern={setIsVisibleModalPattern}
                {...props}
              />
            </div>

            <ButtonAnt
              variant="contained"
              color={darkTheme.basic.secondaryDark}
              width="100%"
              margin="1rem auto"
              disabled={isLoadingCalledNumber || isAutomatic || props.lobby.bingo}
              onClick={() => setIsVisibleModalConfirm(true)}
            >
              Reiniciar tablero
            </ButtonAnt>
          </div>
          <div className="right-container">
            <div className="board-container">
              <BingoBoard {...props} lastNumber={lastNumber} setLastNumber={setLastNumber} isVisible />
            </div>
            <div className="bottom-section">
              <div className="ball-called">
                <LastBall lastNumber={lastNumber} {...props} />
              </div>
              <div className="middle-container">
                {props.lobby.startGame ? (
                  <ButtonAnt
                    width="100%"
                    onClick={() => callNumber()}
                    margin="0 0 1rem 0"
                    disabled={
                      loading ||
                      isLoadingCalledNumber ||
                      isAutomatic ||
                      props.lobby.bingo ||
                      Object.values(props.lobby.board ?? {}).every((num) => num)
                    }
                    loading={isLoadingCalledNumber}
                  >
                    Llamar bolilla
                  </ButtonAnt>
                ) : (
                  <ButtonAnt width="100%" color="success" onClick={() => startGame()} disabled={loading}>
                    Iniciar Juego
                  </ButtonAnt>
                )}

                <LastPlays {...props} />
              </div>
              <div className="controlers">
                <ButtonAnt
                  color="default"
                  width="100%"
                  className="btn-automatic"
                  disabled={!props.lobby.startGame || isLoadingCalledNumber || props.lobby.bingo}
                  onClick={() => setIsAutomatic(!isAutomatic)}
                >
                  {isAutomatic ? "Detener Rep. automática" : "Reproducción automática"}
                </ButtonAnt>

                <SliderControls {...props} />

                <ButtonAnt color="default" width="100%" onClick={() => props.setIsVisibleModalAwards(true)}>
                  Ver Premios
                </ButtonAnt>
              </div>
            </div>
          </div>
        </div>
      </Desktop>
      <Tablet>
        <div className="bingo-board">
          <BingoBoard {...props} setLastNumber={setLastNumber} isVisible />
        </div>
        <div className="pattern-rounds">
          <div className="left-container">
            <div className="card-pattern-container">
              <CardPattern
                key={props.lobby.pattern}
                caption={"Patrón que se debe llenar"}
                apagon={apagon}
                setApagon={setApagon}
                isVisibleModalPattern={isVisibleModalPattern}
                setIsVisibleModalPattern={setIsVisibleModalPattern}
                {...props}
              />
            </div>
            <ButtonAnt
              variant="contained"
              color="default"
              width="90%"
              margin="1rem auto"
              disabled={isLoadingCalledNumber || isAutomatic || props.lobby.bingo}
              onClick={() => setIsVisibleModalConfirm(true)}
            >
              Reiniciar tablero
            </ButtonAnt>
            <ButtonAnt
              color="default"
              width="90%"
              margin="1rem auto"
              className="btn-automatic"
              disabled={!props.lobby.startGame || isLoadingCalledNumber || props.lobby.bingo}
              onClick={() => setIsAutomatic(!isAutomatic)}
            >
              {isAutomatic ? "Detener Rep. automática" : "Reproducción automática"}
            </ButtonAnt>
          </div>
          <div className="right-container">
            <LastBall lastNumber={lastNumber} vertical {...props} />
            <div className="last-plays">
              <LastPlays {...props} />
            </div>
            <div className="btns-container">
              {props.lobby.startGame ? (
                <ButtonAnt
                  width="90%"
                  onClick={() => callNumber()}
                  margin="1rem auto"
                  disabled={loading || isLoadingCalledNumber || isAutomatic || props.lobby.bingo}
                  loading={isLoadingCalledNumber}
                >
                  Llamar bolilla
                </ButtonAnt>
              ) : (
                <ButtonAnt width="100%" color="success" onClick={() => startGame()} disabled={loading} margin="1rem 0">
                  Iniciar Juego
                </ButtonAnt>
              )}
            </div>
            <SliderControls {...props} />
          </div>
        </div>
        <ButtonAnt color="default" width="90%" margin="1rem auto" onClick={() => props.setIsVisibleModalAwards(true)}>
          Ver Premios
        </ButtonAnt>
        <div className="chat-container">
          <Chat title={"CHAT DEL BINGO"} />
        </div>
      </Tablet>
    </>
  );
};

const ContentModal = styled.div`
  width: 100%;

  .title {
    font-family: Encode Sans, sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
  }

  .description {
    margin: 1rem 0;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
  }

  .btns-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;
  }

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 18px;
      line-height: 22px;
    }
  }
`;
