import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Chat } from "../../../../components/chat";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { ModalWinner } from "./ModalWinner";
import { ModalAwards } from "./ModalAwards";
import { UsersTabs } from "./UsersTabs";
import defaultTo from "lodash/defaultTo";
import { UserLayout } from "../userLayout";
import { firestore } from "../../../../firebase";
import { AdminPanel } from "./AdminPanel";
import { UserPanel } from "./UserPanel";
import { ModalFinalStage } from "./ModalFinalStage";
import { ModalUserCard } from "./ModalUserCard";

const TABS = {
  BINGO: { value: "bingo" },
  USERS: { value: "users" },
};

export const LobbyInPlay = (props) => {
  const [authUser] = useGlobal("user");
  const [tabletTab, setTabletTab] = useState("bingo");
  const [isVisibleModalWinner, setIsVisibleModalWinner] = useState(false);
  const [isVisibleModalAwards, setIsVisibleModalAwards] = useState(false);
  const [isVisibleModalFinal, setIsVisibleModalFinal] = useState(false);
  const [isVisibleModalUserCard, setIsVisibleModalUserCard] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (props.lobby.finalStage) setIsVisibleModalFinal(true);
    if (!props.lobby.finalStage) setIsVisibleModalFinal(false);
  }, [props.lobby.finalStage]);

  useEffect(() => {
    setIsVisibleModalWinner(!!props.lobby.bingo);
  }, [props.lobby.bingo]);

  useEffect(() => {
    const currentUserId = authUser.id;
    if (props.lobby?.users?.[currentUserId] || props.lobby.game.usersIds.includes(currentUserId)) return;

    props.logout();
  }, [props.lobby.users]);

  const callBingo = async () =>
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: authUser,
      updateAt: new Date(),
    });

  // TODO: Consider to refactoring, <Admin> & <User>.
  return (
    <>
      <UserLayout {...props} />

      <BingoGameContainer>
        {isVisibleModalFinal && (
          <ModalFinalStage
            isVisibleModalFinal={isVisibleModalFinal}
            setIsVisibleModalFinal={setIsVisibleModalFinal}
            {...props}
          />
        )}
        {isVisibleModalUserCard && (
          <ModalUserCard
            isVisibleModalUserCard={isVisibleModalUserCard}
            setIsVisibleModalUserCard={setIsVisibleModalUserCard}
            user={user}
            {...props}
          />
        )}
        {isVisibleModalAwards && (
          <ModalAwards
            awards={defaultTo(props.lobby.settings.awards, [])}
            isVisibleModalAwards={isVisibleModalAwards}
            setIsVisibleModalAwards={setIsVisibleModalAwards}
            {...props}
          />
        )}
        {isVisibleModalWinner && (
          <ModalWinner
            winner={props.lobby.bingo}
            setUser={setUser}
            setIsVisibleModalUserCard={setIsVisibleModalUserCard}
            isVisibleModalWinner={isVisibleModalWinner}
            setIsVisibleModalWinner={setIsVisibleModalWinner}
            {...props}
          />
        )}
        <Desktop>
          <div className="main-container">
            {authUser.isAdmin ? (
              <AdminPanel
                {...props}
                tabletTab={tabletTab}
                setIsVisibleModalAwards={setIsVisibleModalAwards}
                isVisibleModalFinal={isVisibleModalFinal}
              />
            ) : (
              <UserPanel
                {...props}
                tabletTab={tabletTab}
                callBingo={callBingo}
                setIsVisibleModalAwards={setIsVisibleModalAwards}
              />
            )}
            {(authUser.isAdmin || props.lobby.settings?.showParticipants) && <UsersTabs {...props} />}
          </div>

          <div className="chat-container">
            <Chat title={"CHAT DEL BINGO"} />
          </div>
        </Desktop>
        <Tablet>
          <div className="main-container">
            {(authUser.isAdmin || props.lobby.settings?.showParticipants) && (
              <div className="tablet-tabs">
                <div
                  className={`tab ${tabletTab === TABS.BINGO.value && "active"}`}
                  onClick={() => setTabletTab(TABS.BINGO.value)}
                >
                  Bingo
                </div>
                <div
                  className={`tab ${tabletTab === TABS.USERS.value && "active"}`}
                  onClick={() => setTabletTab(TABS.USERS.value)}
                >
                  Participantes
                </div>
              </div>
            )}
            {tabletTab === "bingo" && authUser.isAdmin && (
              <AdminPanel {...props} tabletTab={tabletTab} setIsVisibleModalAwards={setIsVisibleModalAwards} />
            )}
            {tabletTab === "bingo" && !authUser.isAdmin && (
              <UserPanel
                {...props}
                tabletTab={tabletTab}
                callBingo={callBingo}
                setIsVisibleModalAwards={setIsVisibleModalAwards}
              />
            )}
          </div>
          {tabletTab === "users" && (authUser.isAdmin || props.lobby.settings.showParticipants) && (
            <UsersTabs {...props} />
          )}
        </Tablet>
      </BingoGameContainer>
    </>
  );
};

const BingoGameContainer = styled.div`
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
