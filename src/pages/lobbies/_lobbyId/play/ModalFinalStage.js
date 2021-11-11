import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { UserCard } from "./UserCard";
import { ButtonAnt } from "../../../../components/form";
import { config, firestore } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { createBoard, generateMatrix, getBingoCard } from "../../../../business";
import { ModalPattern } from "./ModalPattern";

export const ModalFinalStage = (props) => {
  const [authUser] = useGlobal("user");
  const [isVisibleModalPattern, setIsVisibleModalPattern] = useState(false);

  const blackout = async () => {
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      pattern: JSON.stringify(generateMatrix(true)),
      finalStage: false,
      updateAt: new Date(),
    });

    props.setIsVisibleModalFinal(false);
  };

  const endGame = async () =>
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      isClosed: true,
      updateAt: new Date(),
    });

  const continueGame = async () => {
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      finalStage: false,
      updateAt: new Date(),
    });

    setIsVisibleModalPattern(false);
    props.setIsVisibleModalFinal(false);
  };

  const newGame = async () => {
    const board = createBoard();
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      round: 0,
      lastPlays: [],
      board,
      finalStage: false,
      updateAt: new Date(),
    });

    props.setIsVisibleModalFinal(false);
  };

  const newCards = async () => {
    const newUsers = Object.values(props.lobby.users).reduce((usersSum, user) => {
      const card = getBingoCard();
      const newUser = { ...user, card: JSON.stringify(card) };
      return { ...usersSum, [newUser.id]: newUser };
    }, {});

    const board = createBoard();

    const promiseNewCards = firestore.doc(`lobbies/${props.lobby.id}`).update({
      round: 0,
      lastPlays: [],
      board,
      finalStage: false,
      updateAt: new Date(),
      users: newUsers,
    });

    const promisesRemoveUsers = Object.keys(props.lobby.users).map(
      async (userId) =>
        await firestore.collection("lobbies").doc(props.lobby.id).collection("users").doc(userId).delete()
    );

    await Promise.all([promiseNewCards, ...promisesRemoveUsers]);

    props.setIsVisibleModalFinal(false);
  };

  const adminContent = () => (
    <AdminContent>
      <ButtonAnt color="secondary" onClick={() => setIsVisibleModalPattern(true)}>
        Continuar juego
      </ButtonAnt>
      <ButtonAnt color="secondary" onClick={() => blackout()}>
        Apagón
      </ButtonAnt>
      <ButtonAnt color="secondary" onClick={() => newCards()}>
        Continuar con cartillas nuevas
      </ButtonAnt>
      <ButtonAnt color="secondary" onClick={() => newGame()}>
        Juego nuevo
      </ButtonAnt>
      <ButtonAnt color="danger" onClick={() => endGame()}>
        Finalizar juego
      </ButtonAnt>
    </AdminContent>
  );

  const userContent = () => (
    <UserContent>
      <div className="description">Esperando que el administrador continue el juego...</div>
      <Image
        src={`${config.storageUrl}/resources/spinner.gif`}
        height="85px"
        width="85px"
        size="contain"
        margin="1rem auto"
      />
    </UserContent>
  );

  return (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      closable={false}
      width="600px"
      visible={props.isVisibleModalFinal}
    >
      {isVisibleModalPattern && (
        <ModalPattern
          continueGame={continueGame}
          isVisibleModalPattern={isVisibleModalPattern}
          setIsVisibleModalPattern={setIsVisibleModalPattern}
          {...props}
        />
      )}
      <Content>
        <div className="title">Ganador</div>
        <div className="main-container">
          <div className="left-container">
            <div className="winner-name">{props.lobby.winners[props.lobby.winners.length - 1].nickname}</div>
            <div className="card-container">
              <UserCard user={props.lobby.winners[props.lobby.winners.length - 1]} {...props} />
            </div>
          </div>
          <div className="right-container">
            {props.lobby.winners[props.lobby.winners.length - 1].award && (
              <>
                <div className="award">Premio</div>
                <div className="award-name">{props.lobby.winners[props.lobby.winners.length - 1].award.name}</div>
              </>
            )}
            {authUser.isAdmin ? adminContent() : userContent()}
          </div>
        </div>
      </Content>
    </ModalContainer>
  );
};

const Content = styled.div`
  width: 100%;

  .title {
    text-align: center;
    font-style: normal;
    font-weight: bold;
    font-size: 36px;
    line-height: 49px;
    color: ${(props) => props.theme.basic.secondary};
  }

  .main-container {
    display: flex;
    flex-direction: column;

    .left-container {
      .winner-name {
        font-style: normal;
        font-weight: bold;
        font-size: 18px;
        line-height: 25px;
        color: ${(props) => props.theme.basic.blackDarken};
        margin-bottom: 2rem;
        text-align: center;
      }
      .card-container {
        overflow-x: auto;
        margin: 0 auto;
      }
    }
    .right-container {
      .award {
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.blackDarken};
        margin: 0.5rem 0;
        text-align: center;
      }

      .award-name {
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        line-height: 19px;
        margin: 0.5rem 0;
        text-align: center;
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .main-container {
      display: grid;
      grid-template-columns: 320px auto;

      .left-container {
        .winner-name {
          text-align: center;
        }
        .card-container {
          max-width: 320px;
        }
      }
      .right-container {
        .award,
        .award-name {
          text-align: end;
        }
      }
    }
  }
`;

const AdminContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  height: 80%;

  button {
    width: 90%;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    margin: 0.5rem auto;
  }

  ${mediaQuery.afterTablet} {
    button {
      margin: 0.5rem 0;
    }
  }
`;

const UserContent = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  flex-direction: column;
  height: 80%;

  .description {
    word-wrap: break-word;
    text-align: center;
    font-family: Encode Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => props.theme.basic.blackDarken};
    max-width: 100%;
  }
`;
