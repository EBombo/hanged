import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Popover, Slider } from "antd";
import { mediaQuery } from "../../../constants";
import { config } from "../../../firebase";
import { Image } from "../../../components/common/Image";
import { useTranslation } from "../../../hooks/useTranslation";

export const UserLayout = (props) => {
  const [authUser] = useGlobal("user");
  const [audios] = useGlobal("audios");

  const { t } = useTranslation();

  const [isPlay, setIsPlay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(20);

  useEffect(() => {
    if (!audios?.length) return;

    const currentAudioToPlayId = props.lobby.settings?.audio?.id ?? audios[0]?.id;
    const currentAudioToPlay = audios.find((audio) => audio.id === currentAudioToPlayId);

    const currentAudio = props.audioRef.current ?? new Audio(currentAudioToPlay.audioUrl);

    props.audioRef.current = currentAudio;
    props.audioRef.current.play();
  }, []);

  return (
    <UserLayoutCss>
      <div className="left-content">
        {authUser.isAdmin ? (
          <div className="left-container">
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
                  "???"
                )}
              </button>
            </Popover>
            <Popover
              content={
                <SliderContent>
                  <Slider
                    value={volume}
                    defaultValue={20}
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
                    props.audioRef.current.volume = 20 / 100;
                    setVolume(20);

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
                  {t("nav.exit")}
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
      <div className="title no-wrap">{props.lobby.game.name}</div>
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
  position: relative;
  z-index: 2;

  .title {
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
    font-size: 18px;
    line-height: 22px;
    font-weight: bold;

    ${mediaQuery.afterTablet} {
      font-size: 24px;
      line-height: 36px;
    }
  }

  .left-content {
    display: flex;

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

  .left-container {
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
    position: relative;
    padding: 0 1rem;

    .description {
      font-size: 18px;
      line-height: 22px;
    }

    .left-container {
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
