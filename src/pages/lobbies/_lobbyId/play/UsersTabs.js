import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { Input, Popover } from "antd";
import orderBy from "lodash/orderBy";
import { ModalUserCard } from "./ModalUserCard";
import { config, firestore } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { getNumberBoard } from "../../../../business";
import { ModalConfirm } from "../../../../components/modal/ModalConfirm";
import { UserProgress } from "./UserProgress";
import { ButtonAnt } from "../../../../components/form";

const { Search } = Input;

const TAB = {
  CARDS: "cards",
  TABLE: "table",
};

export const UsersTabs = (props) => {
  const [authUser] = useGlobal("user");
  const [tab, setTab] = useState(TAB.CARDS);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVisibleModalUserCard, setIsVisibleModalUserCard] = useState(false);
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    resetUsers();
  }, []);

  const resetUsers = () => {
    let newUsers = Object.values(props.lobby.users ?? {});
    newUsers = orderBy(newUsers, ["nickname"], ["desc"]);
    setUsers(newUsers);
  };

  const numberWinners = getNumberBoard(props.lobby.board ?? {});
  const lobbyPattern = JSON.parse(props.lobby.pattern ?? "[]");

  const removeUser = async (userId) => {
    const newUsers = {
      ...props.lobby.users,
    };
    delete newUsers[userId];
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      users: newUsers,
    });
  };

  const filterUsers = (value) => {
    if (value === "") return resetUsers();

    const newUsers = users.filter((user) => user.nickname.includes(value));
    setUsers(newUsers);
  };

  const menu = (user) => (
    <Popover
      trigger="click"
      placement="bottom"
      content={
        <div
          style={{
            display: "flex",
            cursor: "pointer",
          }}
          onClick={() => setIsVisibleModalConfirm(true)}
        >
          <Image
            src={`${config.storageUrl}/resources/close.svg`}
            filter="brightness(0.5)"
            height="15px"
            width="15px"
            size="contain"
            margin="auto 5px"
          />{" "}
          <div
            style={{
              margin: "auto",
            }}
          >
            Remover jugador
          </div>
        </div>
      }
    >
      <div className="more">
        <div />
        <div />
        <div />
      </div>
    </Popover>
  );

  return (
    <TabsContainer>
      {isVisibleModalUserCard && (
        <ModalUserCard
          isVisibleModalUserCard={isVisibleModalUserCard}
          setIsVisibleModalUserCard={setIsVisibleModalUserCard}
          user={currentUser}
          {...props}
        />
      )}
      {isVisibleModalConfirm && (
        <ModalConfirm
          isVisibleModalConfirm={isVisibleModalConfirm}
          setIsVisibleModalConfirm={setIsVisibleModalConfirm}
          title="Estas seguro de esta acción?"
          description={"El usuario será eliminado"}
          action={removeUser}
          buttonName={"Remover"}
          {...props}
        />
      )}
      {/* TODO: Consider refactoring to use mediaQuery and not use <Desktop> & <Tablet> */}
      <Desktop>
        <div className="tabs-container-desktop">
          <div className="left-side">Participantes ({Object.keys(props.lobby.users).length})</div>
          <div className="right-side">
            <ButtonAnt
              className={`btn-tab ${tab === TAB.CARDS ? "active" : ""}`}
              color="default"
              margin="0 0.5rem"
              onClick={() => setTab(TAB.CARDS)}
            >
              Cuadrícula
            </ButtonAnt>
            <ButtonAnt
              className={`btn-tab ${tab === TAB.TABLE ? "active" : ""}`}
              color="default"
              margin="0 0.5rem"
              onClick={() => setTab(TAB.TABLE)}
            >
              Tabla
            </ButtonAnt>
            <Input.Search
              className="input-search"
              placeholder="Buscar por nombre"
              onSearch={(value) => filterUsers(value, event)}
            />
          </div>
        </div>
      </Desktop>
      <Tablet>
        <div className="tabs-container">
          <ButtonAnt
            className={`btn-tab ${tab === TAB.CARDS ? "active" : ""}`}
            color="default"
            margin="0 0.5rem"
            onClick={() => setTab(TAB.CARDS)}
          >
            Cuadrícula
          </ButtonAnt>
          <ButtonAnt
            className={`btn-tab ${tab === TAB.TABLE ? "active" : ""}`}
            color="default"
            margin="0 0.5rem"
            onClick={() => setTab(TAB.TABLE)}
          >
            Tabla
          </ButtonAnt>
        </div>
      </Tablet>
      {/* TODO: Consider refactoring to use mediaQuery and not use <Desktop> & <Tablet> */}

      <div className={`user-tab-${tab}`}>
        {users.map((user, index) =>
          tab === TAB.CARDS ? (
            <div
              className={`user-card ${props.lobby?.bingo?.id === user.id && `winner`}`}
              key={`${user.nickname}-${index}`}
            >
              {props.lobby?.bingo?.id === user.id && (
                <div className="winner-img">
                  <Image
                    src={`${config.storageUrl}/resources/balls/bingo-ball.svg`}
                    height="30px"
                    width="30px"
                    borderRadious="50%"
                  />
                </div>
              )}

              <div className={`name ${authUser.id === user.id && "auth-user"}`}>{user.nickname}</div>

              <div className="card-preview">
                <UserProgress {...props} lobbyPattern={lobbyPattern} user={user} numberWinners={numberWinners} isCard />
              </div>

              {(authUser.isAdmin || props.lobby.settings.showAllCards) && (
                <div className="btn-container">
                  <button
                    className="btn-show-card"
                    onClick={() => {
                      setCurrentUser(user);
                      setIsVisibleModalUserCard(true);
                    }}
                  >
                    Ver cartilla
                  </button>
                </div>
              )}

              {authUser.isAdmin && menu(user)}
            </div>
          ) : (
            <div
              className={`user-progress ${props.lobby?.bingo?.id === user.id && `winner`}`}
              key={`${user.nickname}-${index}`}
            >
              <div className={`name ${authUser.id === user.id && "auth-user"}`}>{user.nickname}</div>

              <div className={`progress ${user.progress === 100 && "winner"}`}>
                <UserProgress {...props} lobbyPattern={lobbyPattern} user={user} numberWinners={numberWinners} />
              </div>

              {props.lobby?.bingo?.id === user.id && (
                <div className="winner-img">
                  <Image
                    src={`${config.storageUrl}/resources/balls/bingo-ball.svg`}
                    height="30px"
                    width="30px"
                    borderRadious="50%"
                  />
                </div>
              )}
              <div className="options">
                {(authUser.isAdmin || props.lobby.settings.showAllCards) && (
                  <button
                    className="btn-show-card"
                    onClick={() => {
                      setCurrentUser(user);
                      setIsVisibleModalUserCard(true);
                    }}
                  >
                    Ver cartilla
                  </button>
                )}
                {authUser.isAdmin && menu(user)}
              </div>
            </div>
          )
        )}
      </div>
    </TabsContainer>
  );
};

const TabsContainer = styled.div`
  width: 100%;

  .btn-show-card {
    cursor: pointer;
    height: 21px;
    font-family: Encode Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 14px;
    background: ${(props) => props.theme.basic.secondary};
    color: ${(props) => props.theme.basic.whiteLight};
    border: none;
    padding: 0 5px;
    border-radius: 2px;
  }

  .tabs-container {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    button {
      padding: 5px !important;
    }

    .tab {
      padding: 0.5rem 1rem;
      text-align: center;
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      line-height: 14px;
      position: relative;
      cursor: pointer;
      color: ${(props) => props.theme.basic.secondary};
    }
  }

  .user-tab {
    &-cards {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 0.5rem;
      padding: 1rem;

      .user-card {
        display: grid;
        padding: 0.5rem;
        border-radius: 3px;
        align-items: center;
        justify-items: center;
        grid-template-columns: 1fr 1fr 1fr 15px;
        background: ${(props) => props.theme.basic.whiteDark};

        .name {
          text-align: center;
          font-family: Encode Sans, sans-serif;
          font-style: normal;
          font-weight: bold;
          font-size: 13px;
          line-height: 18px;

          &.auth-user {
            color: ${(props) => props.theme.basic.primary};
          }
        }
      }

      .winner {
        background: ${(props) => props.theme.basic.primaryLight};
        border: 3px solid ${(props) => props.theme.basic.primary};
        box-sizing: border-box;
        border-radius: 3px;
        position: relative;

        .winner-img {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
        }
      }

      .card-preview {
        width: 42px;
        height: 42px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        align-items: center;
        grid-gap: 1px;
        padding: 3px;
        background: ${(props) => props.theme.basic.blackDarken};
        border-radius: 3px;

        .matrix-num {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 6px;
          height: 6px;
          border-radius: 2px;
          background: ${(props) => props.theme.basic.blackLighten};
        }

        .active {
          background: ${(props) => props.theme.basic.primary};
        }
      }

      .more {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 25px;
        cursor: pointer;

        div {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: ${(props) => props.theme.basic.blackLighten};
        }
      }
    }

    &-table {
      width: 100%;
      display: flex;
      flex-direction: column;

      .user-progress {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(3, 1fr);
        height: 40px;
        border: 1px solid #dedede;
        background: ${(props) => props.theme.basic.whiteLight};
        padding: 0 1rem;

        .name {
          font-family: Encode Sans, sans-serif;
          font-style: normal;
          font-weight: bold;
          font-size: 13px;
          line-height: 18px;

          &.auth-user {
            color: ${(props) => props.theme.basic.primary};
          }
        }

        .progress {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .ant-progress {
            max-width: 250px;

            .ant-progress-inner {
              background: ${(props) => props.theme.basic.grayDark} !important;
            }
          }
        }

        .options {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .more {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            height: 25px;
            cursor: pointer;
            margin-left: 10px;

            div {
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: ${(props) => props.theme.basic.blackLighten};
            }
          }
        }
      }

      .winner {
        grid-template-columns: repeat(4, 1fr);
        background: ${(props) => props.theme.basic.primaryLight};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .btn-show-card {
      padding: 0 20px;
      border-radius: 4px;
    }

    .tabs-container-desktop {
      height: 48px;
      background: ${(props) => props.theme.basic.secondary};
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      margin-bottom: 1rem;

      .left-side {
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 18px;
        line-height: 22px;
        color: ${(props) => props.theme.basic.whiteLight};
      }

      .right-side {
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        .input-search {
          box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
          width: 300px;

          input,
          button {
            border: none;
            background: ${(props) => props.theme.basic.secondaryDarken};
            font-family: Lato;
            font-style: normal;
            font-weight: bold;
            font-size: 11px;
            line-height: 13px;
            color: ${(props) => props.theme.basic.primary};
            border-radius: 4px 0 0 4px;
            height: 30px;
          }

          button {
            border-radius: 0 4px 4px 0;

            svg {
              color: ${(props) => props.theme.basic.primary};
            }
          }
        }
      }
    }
  }

  .btn-tab {
    font-family: Lato, sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    padding: 5px 20px !important;

    &.active {
      color: ${(props) => props.theme.basic.primary};
    }
  }
`;
