import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import defaultTo from "lodash/defaultTo";
import { UserLayout } from "../userLayout";
import { firestore } from "../../../../firebase";
import { HangedMan } from "./HangedMan";
import { Timer } from "./Timer";
import { Alphabet } from "./Alphabet";
import { ButtonAnt } from "../../../../components/form";

export const LobbyInPlay = (props) => {
  const [authUser] = useGlobal("user");
  const [user, setUser] = useState(null);

  const [currentPhrase, setCurrentPhrase] = useState("hola");

  useEffect(() => {
    const currentUserId = authUser.id;
    if (props.lobby?.users?.[currentUserId] || props.lobby.game.usersIds.includes(currentUserId)) return;

    props.logout();
  }, [props.lobby.users]);


  // TODO: Consider to refactoring, <Admin> & <User>.
  return (
    <>
      <UserLayout {...props} />

      <HangedGameContainer>
        <Timer {...props}/>
        <HangedMan {...props}/>
        <div className="">
          {currentPhrase.split('').map(
            (letter) => 
              letter === " "
                ? <span className="whitespace">&nbsp;</span>
                : <span className="letter">{letter}</span>
          )}
        </div>
        <Alphabet {...props}/>
      </HangedGameContainer>
      <GameActions>
        <ButtonAnt color="default" className="btn-action">Editar juego</ButtonAnt>
        <ButtonAnt color="danger" className="btn-action">Saltar turno</ButtonAnt>
      </GameActions>
    </>
  );
};

const GameActions = styled.div`
  display: flex;
  justify-content: space-between;
  .btn-action {
    display: inline-block;
  }
`;

const HangedGameContainer = styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  .main-container {
    .top-container-user {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      align-items: center;
      justify-content: center;
      margin: 1rem 0;
      padding: 0.5rem;
      .pattern {
        background: ${(props) => props.theme.basic.secondary};
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        padding: 0.5rem 1rem;
        margin: 0 auto;
        max-width: 220px;
      }
    }
    .bingo-card-container {
      margin: 0 auto;
    }
    .buttons-container {
      margin: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      align-items: center;
      button {
        width: 100%;
      }
    }
    .tablet-tabs {
      height: 32px;
      background: ${(props) => props.theme.basic.primary};
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      .tab {
        padding: 0.5rem 1rem;
        text-align: center;
        font-family: "Encode Sans", sans-serif;
        font-style: normal;
        font-size: 15px;
        font-weight: 400 !important;
        line-height: 17px;
        position: relative;
        cursor: pointer;
        color: ${(props) => props.theme.basic.secondary};
      }
      .active {
        color: ${(props) => props.theme.basic.whiteLight};
      }
      .active::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 2px;
        background: ${(props) => props.theme.basic.whiteLight};
      }
    }
    .bingo-board {
      margin: 1rem auto;
      padding: 0.5rem;
    }
    .pattern-rounds {
      display: grid;
      align-items: center;
      grid-template-columns: repeat(2, 50%);
      margin: 1rem 0;
      .left-container {
        .card-pattern-container {
          background: ${(props) => props.theme.basic.secondary};
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
          border-radius: 4px;
          padding: 0.5rem 1rem;
          margin: 0 auto;
          max-width: 250px;
        }
      }
      .right-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        .last-plays {
          width: 100%;
          max-width: 200px;
        }
        .btns-container {
          width: 100%;
          button {
            padding: 1rem;
          }
        }
      }
    }
    .options-container {
      margin: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .awards {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    text-decoration: underline;
    color: ${(props) => props.theme.basic.primaryLight};
    cursor: pointer;
    padding: 1rem;
    max-width: 430px;
    margin: 0 auto;
  }
  .chat-container {
    height: 550px;
  }
  .last-plays-container {
    margin: 0.5rem auto;
    overflow: auto;
    max-width: 430px;
  }
  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: calc(100% - 300px) 300px;
    .main-container {
      padding: 0;
      overflow: auto;
      .user-content {
        display: grid;
        padding: 0.5rem 0.5rem 2rem 0.5rem;
        grid-template-columns: auto auto;
        grid-gap: 1rem;
        border-bottom: 10px solid ${(props) => props.theme.basic.primary};
        overflow: auto;
        .left-user-content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          button {
            width: 100%;
            max-width: 350px;
            margin: 1rem auto;
            padding: 1rem;
            font-size: 25px;
            line-height: 30px;
          }
        }
        .right-user-content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .board-container {
            width: 100%;
          }
          .bottom-section {
            display: grid;
            grid-template-columns: auto minmax(250px, auto) minmax(200px, auto);
            grid-gap: 1rem;
            align-items: center;
            width: 100%;
            margin: 1rem 0;
            .last-plays-container {
              margin: 0;
              min-width: 250px;
            }
            .pattern {
              background: ${(props) => props.theme.basic.secondary};
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
              border-radius: 4px;
              padding: 0.5rem 1rem;
            }
          }
        }
      }
    }
    .chat-container {
      height: 100%;
    }
    .bingo {
      padding: 0.5rem 0.5rem 2rem 0.5rem;
      display: grid;
      grid-template-columns: 250px auto;
      border-bottom: 10px solid ${(props) => props.theme.basic.primary};
      grid-gap: 2rem;
      overflow: auto;
      .left-container {
        .card-pattern-container {
          background: ${(props) => props.theme.basic.secondary};
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
          padding: 1rem;
          border-radius: 4px;
        }
      }
      .right-container {
        .board-container {
          margin: 0;
        }
        .awards {
          padding: 0;
        }
        .bottom-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 1rem;
          align-items: center;
          max-width: 800px;
          margin: 1rem 0;
        }
      }
      .subtitle {
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 18px;
        line-height: 22px;
        color: ${(props) => props.theme.basic.whiteLight};
        padding: 1rem;
      }
    }
  }
`;
