import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Popover, Slider } from "antd";
import { mediaQuery } from "../../../constants";
import { config } from "../../../firebase";
import { Image } from "../../../components/common/Image";

export const UserLayout = (props) => {
  const [authUser] = useGlobal("user");
  const [audios] = useGlobal("audios");
  const [isPlay, setIsPlay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(30);

  return (
    <UserLayoutCss>
      <div className="description">1-75 números</div>
      <div className="title no-wrap">{props.lobby.game.name}</div>
      <div className="right-content">
        {authUser.isAdmin ? (
          <div className="right-container">
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
                      }}
                    >
                      {audio_.title}
                    </div>
                  ))}
                </AudioStyled>
              }
            >
              <button className="nav-button" key={props.audioRef.current?.paused}>
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
              </button>
            </Popover>
            <Popover
              content={
                <SliderContent>
                  <Slider
                    value={volume}
                    defaultValue={30}
                    onChange={(value) => {
                      if (!props.audioRef.current) return;

                      props.audioRef.current.volume = value / 100;
                      setVolume(value);
                    }}
                  />
                </SliderContent>
              }
            >
              <button
                className="nav-button"
                disabled={!isPlay}
                onClick={() => {
                  if (!props.audioRef.current) return;

                  if (props.audioRef.current.volume === 0) {
                    props.audioRef.current.volume = 30 / 100;
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
                  src={
                    isMuted ? `${config.storageUrl}/resources/mute.svg` : `${config.storageUrl}/resources/volume.svg`
                  }
                  height="25px"
                  width="25px"
                  size="contain"
                  margin="auto"
                />
              </button>
            </Popover>
          </div>
        ) : (
          <Popover
            trigger="click"
            content={
              <div>
                <div onClick={() => props.logout()} style={{ cursor: "pointer" }}>
                  Salir
                </div>
              </div>
            }
          >
            <div className="icon-menu">
              <span />
              <span />
              <span />
            </div>
          </Popover>
        )}
      </div>
    </UserLayoutCss>
  );
};

const UserLayoutCss = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  background: ${(props) => props.theme.basic.whiteDark};
  padding: 0.5rem;
  height: 50px;

  .title {
    text-align: center;
  }

  .right-content {
    display: flex;
    justify-content: flex-end;

    .icon-menu {
      cursor: pointer;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      flex-direction: column;
      height: 30px;

      span {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }

  .description {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
  }

  .right-container {
    display: flex;
    align-items: center;

    button {
      width: 30px;
      height: 30px;
      border: none;
      background: ${(props) => props.theme.basic.whiteLight};
      border-radius: 50%;
      margin: 0 5px;
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 0 1rem;

    .description {
      font-size: 18px;
      line-height: 22px;
    }

    .right-container {
      button {
        width: 40px;
        height: 40px;
        margin: 0 1rem;
      }
    }
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

const SliderContent = styled.div`
  width: 100px;

  .ant-slider-track {
    background-color: ${(props) => props.theme.basic.success} !important;
  }

  .ant-slider-handle {
    border: solid 2px ${(props) => props.theme.basic.successDark} !important;
  }
`;
