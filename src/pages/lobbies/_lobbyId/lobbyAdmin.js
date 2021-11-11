import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useGlobal, useState } from "reactn";
import { Divider } from "../../../components/common/Divider";
import { config, database, firestore } from "../../../firebase";
import { ButtonAnt, ButtonBingo } from "../../../components/form";
import { mediaQuery } from "../../../constants";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Popover, Slider } from "antd";
import { getBingoCard } from "../../../business";
import { Image } from "../../../components/common/Image";

export const LobbyAdmin = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;
  const [audios] = useGlobal("audios");
  const [users, setUsers] = useState([]);
  const [volume, setVolume] = useState(30);
  const [isPlay, setIsPlay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingLock, setIsLoadingLock] = useState(false);
  const [isLoadingStart, setIsLoadingStart] = useState(false);

  useEffect(() => {
    if (!props.lobby) return;

    const fetchUsers = async () => {
      const userStatusDatabaseRef = database.ref(`lobbies/${lobbyId}/users`);
      userStatusDatabaseRef.on("value", (snapshot) => {
        let users_ = Object.values(snapshot.val() ?? {});
        users_ = users_.filter((user) => user.state.includes("online"));
        setUsers(users_);
      });
    };

    fetchUsers();
  }, [props.lobby]);

  useEffect(() => {
    const currentAudioToPlay = props.lobby.game?.audio?.audioUrl ?? audios[0]?.audioUrl;

    const currentAudio = props.audioRef.current ?? new Audio(currentAudioToPlay);

    props.audioRef.current = currentAudio;
    props.audioRef.current.play();
  }, []);

  const updateLobby = async (isLocked = false, gameStarted = null) => {
    try {
      if (!lobbyId) throw Error("Lobby not exist");

      let newLobby = {
        isLocked,
        startAt: gameStarted,
        updateAt: new Date(),
      };

      if (gameStarted) newLobby.users = mapUsersWithCards();

      await firestore.doc(`lobbies/${lobbyId}`).update(newLobby);
    } catch (error) {
      props.showNotification("ERROR", "Lobby not exist");
      console.error(error);
    }
  };

  const mapUsersWithCards = () =>
    users.reduce((usersSum, user) => {
      const card = getBingoCard();
      const newUser = { ...user, id: user.userId, card: JSON.stringify(card) };
      return { ...usersSum, [newUser.id]: newUser };
    }, {});

  return (
    <LobbyCss>
      <div className="header">
        <div className="left-menus">
          <Popover
            trigger="click"
            content={
              <AudioStyled>
                {audios.map((audio_) => (
                  <div
                    key={audio_.id}
                    className="item-audio"
                    onClick={() => {
                      if (props.audioRef.current) props.audioRef.current.pause();

                      const currentAudio = new Audio(audio_.audioUrl);

                      props.audioRef.current = currentAudio;
                      props.audioRef.current.volume = volume / 100;
                      props.audioRef.current.play();
                      setIsPlay(true);
                      setIsMuted(false);
                    }}
                  >
                    {audio_.title}
                  </div>
                ))}
              </AudioStyled>
            }
          >
            <ButtonBingo variant="primary" margin="10px 20px">
              {isPlay ? (
                <Image
                  cursor="pointer"
                  src={`${config.storageUrl}/resources/sound.svg`}
                  height="25px"
                  width="25px"
                  size="contain"
                  margin="auto"
                />
              ) : (
                "►"
              )}
            </ButtonBingo>
          </Popover>
          <Popover
            content={
              <SliderContent>
                <Slider
                  defaultValue={30}
                  value={volume}
                  onChange={(value) => {
                    if (!props.audioRef.current) return;

                    props.audioRef.current.volume = value / 100;
                    setVolume(value);
                  }}
                />
              </SliderContent>
            }
          >
            <ButtonBingo
              variant="primary"
              margin="10px 20px"
              disabled={!isPlay}
              onClick={() => {
                if (!props.audioRef.current) return;

                if (props.audioRef.current.volume === 0) {
                  props.audioRef.current.volume = 0.3;
                  setVolume(30);

                  return setIsMuted(false);
                }
                setVolume(0);
                props.audioRef.current.volume = 0;
                setIsMuted(true);
              }}
              key={isMuted}
            >
              <Image
                cursor="pointer"
                src={isMuted ? `${config.storageUrl}/resources/mute.svg` : `${config.storageUrl}/resources/volume.svg`}
                height="25px"
                width="25px"
                size="contain"
                margin="auto"
              />
            </ButtonBingo>
          </Popover>
        </div>

        <div className="item-pin">
          <div className="label">{props.lobby.isLocked ? "Este juego esta bloqueado" : "Entra a www.ebombo.io"}</div>
          <div className="pin-label">Pin del juego:</div>
          <div className="pin">
            {props.lobby.isLocked ? (
              <ButtonBingo variant="primary" margin="10px 20px">
                <Image
                  cursor="pointer"
                  src={`${config.storageUrl}/resources/lock.svg`}
                  height="25px"
                  width="25px"
                  size="contain"
                  margin="auto"
                />
              </ButtonBingo>
            ) : (
              props.lobby?.pin
            )}
          </div>
        </div>

        <div className="right-menus">
          <ButtonBingo
            variant="primary"
            margin="10px 20px"
            disabled={isLoadingLock}
            loading={isLoadingLock}
            onClick={async () => {
              setIsLoadingLock(true);
              await updateLobby(!props.lobby.isLocked);
              setIsLoadingLock(false);
            }}
          >
            {!isLoadingLock && (
              <Image
                src={`${config.storageUrl}/resources/${props.lobby.isLocked ? "lock.svg" : "un-lock.svg"}`}
                cursor="pointer"
                height="25px"
                width="25px"
                size="contain"
                margin="auto"
              />
            )}
          </ButtonBingo>
          <ButtonAnt
            className="btn-start"
            loading={isLoadingStart}
            disabled={!users?.length || isLoadingStart}
            onClick={async () => {
              setIsLoadingStart(true);
              await updateLobby(true, new Date());
              setIsLoadingStart(false);
            }}
          >
            Empezar
          </ButtonAnt>
        </div>
      </div>

      <Divider />

      <div className="container-users">
        <div className="all-users">
          {users?.length ?? 0} <UserOutlined />
        </div>
        <div className="list-users">
          {users.map((user) => (
            <div key={user.userId} className="item-user">
              {user.nickname}
            </div>
          ))}
        </div>
      </div>
    </LobbyCss>
  );
};

const SliderContent = styled.div`
  width: 100px;

  .ant-slider-track {
    background-color: ${(props) => props.theme.basic.success} !important;
  }

  .ant-slider-handle {
    border: solid 2px ${(props) => props.theme.basic.successDark} !important;
  }
`;

const AudioStyled = styled.div`
  width: 100%;

  .item-audio {
    cursor: pointer;
    padding: 0 10px;

    &:hover {
      color: ${(props) => props.theme.basic.secondary};
      background: ${(props) => props.theme.basic.primaryLight};
    }
  }
`;

const LobbyCss = styled.div`
  width: fit-content;

  ${mediaQuery.afterTablet} {
    width: auto;
  }

  .header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    .right-menus {
      .btn-start {
        margin: 10px 20px !important;
        padding: 10px 30px !important;
      }
    }

    .right-menus,
    .left-menus {
      text-align: center;
      display: flex;
      align-items: flex-start;
      justify-content: space-evenly;
    }

    .left-menus {
      button {
        width: 45px;
        box-shadow: none;
        border-radius: 50px;
      }
    }

    .item-pin {
      width: 370px;
      height: 370px;
      font-size: 20px;
      max-width: 400px;
      border-radius: 50%;
      padding-top: 175px;
      text-align: center;
      margin: -175px auto 2rem auto;
      color: ${(props) => props.theme.basic.white};
      box-shadow: 0 25px 0 ${(props) => props.theme.basic.secondaryDark};

      .pin-label {
        font-size: 2rem;
      }

      .pin {
        font-size: 2rem;
      }

      .label {
        background: ${(props) => props.theme.basic.white};
        color: ${(props) => props.theme.basic.black};
        font-family: Gloria Hallelujah;
        font-style: normal;
        font-weight: normal;
      }
    }
  }

  .container-users {
    padding: 10px 15px;

    ${mediaQuery.afterTablet} {
      padding: 10px 5rem;
    }

    .all-users {
      padding: 5px 10px;
      width: fit-content;
      border-radius: 3px;
      margin-bottom: 2rem;
      color: ${(props) => props.theme.basic.white};
      background: ${(props) => props.theme.basic.primaryDark};
    }

    .list-users {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;

      ${mediaQuery.afterTablet} {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 10px;
      }

      .item-user {
        padding: 5px 10px;
        text-align: center;
        border-radius: 5px;
        color: ${(props) => props.theme.basic.white};
        background: ${(props) => props.theme.basic.primary};

        ${mediaQuery.afterTablet} {
          padding: 15px 10px;
        }
      }
    }
  }
`;
