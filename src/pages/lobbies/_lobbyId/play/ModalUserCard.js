import React, { useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { ButtonAnt } from "../../../../components/form";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { UserCard } from "./UserCard";
import { BingoBoard } from "./BingoBoard";
import { firestore } from "../../../../firebase";
import defaultTo from "lodash/defaultTo";
import { ModalConfirm } from "../../../../components/modal/ModalConfirm";

export const ModalUserCard = (props) => {
  const [isVisibleAssignAward, setIsVisibleAssignAward] = useState(false);
  const [awardSelected, setAwardSelected] = useState(null);
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);

  const disqualifyUser = async () => {
    props.setIsVisibleModalUserCard(false);

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: null,
      updateAt: new Date(),
    });
  };

  const bannedUser = async () => {
    props.setIsVisibleModalUserCard(false);

    const bannedUsersId = [...defaultTo(props.lobby.bannedUsersId, []), props.user.id];

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: null,
      updateAt: new Date(),
      bannedUsersId,
    });
  };

  const saveBingoWinner = async () => {
    const winners = props.lobby.winners
      ? [...props.lobby.winners, { ...props.user, award: awardSelected }]
      : [{ ...props.user, award: awardSelected }];

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: null,
      winners,
      finalStage: true,
      updateAt: new Date(),
    });

    props.setIsVisibleModalUserCard(false);
  };

  const modalContent = () => {
    if (isVisibleAssignAward && props.lobby.bingo && props.user.id === props.lobby.bingo.id) {
      return (
        <ModalContainer
          background="#FAFAFA"
          footer={null}
          closable={false}
          topDesktop="20%"
          width="650px"
          visible={props.isVisibleModalUserCard}
        >
          <ContentAward>
            <div className="main-content-award">
              <div className="first-content">
                <div className="top-container">
                  <div className="name">{props.user.nickname}</div>
                  <div className="btn-container">
                    <ButtonAnt color="danger" className="disqualify" onClick={() => disqualifyUser()}>
                      Invalidar
                    </ButtonAnt>
                  </div>
                </div>
                <div className="card-container">
                  <UserCard user={props.user} {...props} />
                </div>
              </div>
              {props.lobby.settings.awards && (
                <div className="second-content">
                  <div className="subtitle">Escoge el premio</div>
                  <div className="awards">
                    {props.lobby.settings.awards.map((award, index) => (
                      <div className="award-content" key={`${award.name}-${index}`}>
                        <input
                          type="checkbox"
                          name="award[1][]"
                          className="input-checkbox"
                          value={index}
                          checked={award.name === awardSelected?.name}
                          onChange={() => setAwardSelected(award)}
                        />
                        <label>{award.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="btns-container">
              <ButtonAnt color="default" onClick={() => setIsVisibleAssignAward(false)}>
                Volver
              </ButtonAnt>
              <ButtonAnt onClick={() => saveBingoWinner()}>Guardar y anunciar</ButtonAnt>
            </div>
          </ContentAward>
        </ModalContainer>
      );
    }

    switch (props.user?.id) {
      case defaultTo(props.lobby?.bingo?.id, ""):
        return (
          <ModalContainer
            background="#FAFAFA"
            footer={null}
            closable={false}
            topDesktop="20%"
            padding="1rem"
            visible={props.isVisibleModalUserCard}
            width="1100px"
          >
            <ContainerValidate>
              <ModalConfirm
                isVisibleModalConfirm={isVisibleModalConfirm}
                setIsVisibleModalConfirm={setIsVisibleModalConfirm}
                title="El usuario sera bloqueado permanentemente. Deseas continuar? "
                description={"Si vuelves no se guardaran los cambios."}
                action={() => bannedUser()}
                buttonName={"Suspender"}
                {...props}
              />
              <Desktop>
                <div className="board-container">
                  <BingoBoard {...props} isView isVisible />
                  <div className="action-container">
                    <div />
                    {/* TODO: Consider remove this btn.*/}
                    {/*
                      <ButtonAnt color="default" onClick={() => props.setIsVisibleModalUserCard(false)}>
                        Volver
                      </ButtonAnt>
                    */}
                    <ButtonAnt onClick={() => setIsVisibleAssignAward(true)}>Bingo</ButtonAnt>
                  </div>
                </div>
                <div className="card-container">
                  <div className="top-container">
                    <div className="name">{props.user.nickname}</div>
                    <div className="btns-container">
                      <ButtonAnt
                        color="warning"
                        className="disqualify"
                        margin={"0 5px"}
                        onClick={() => disqualifyUser()}
                      >
                        Invalidar
                      </ButtonAnt>
                      <ButtonAnt
                        color="danger"
                        className="disqualify"
                        margin={"0 5px"}
                        onClick={() => setIsVisibleModalConfirm(true)}
                      >
                        Suspender
                      </ButtonAnt>
                    </div>
                  </div>
                  <UserCard user={props.user} {...props} />
                </div>
              </Desktop>
              <Tablet>
                <div className="top-container">
                  <div className="name">{props.user.nickname}</div>
                  <div className="btns-container">
                    <ButtonAnt color="warning" className="disqualify" onClick={() => disqualifyUser()}>
                      Invalidar
                    </ButtonAnt>
                    <ButtonAnt color="danger" className="disqualify" onClick={() => setIsVisibleModalConfirm(true)}>
                      Suspender
                    </ButtonAnt>
                  </div>
                </div>
                <div className="card-container">
                  <UserCard user={props.user} {...props} />
                </div>
                <div className="board-container">
                  <BingoBoard {...props} isView isVisible />
                </div>
                <div className="action-container">
                  {/* TODO: Consider remove this btn.*/}
                  {/*<ButtonAnt color="default" onClick={() => props.setIsVisibleModalUserCard(false)}>
                      Volver
                    </ButtonAnt>*/}
                  <ButtonAnt onClick={() => setIsVisibleAssignAward(true)}>Bingo</ButtonAnt>
                </div>
              </Tablet>
            </ContainerValidate>
          </ModalContainer>
        );

      default:
        return (
          <ModalContainer
            background="#FAFAFA"
            footer={null}
            closable={false}
            topDesktop="20%"
            padding="1rem"
            visible={props.isVisibleModalUserCard}
          >
            <Content>
              <div className="title-card">Cartilla {props.user.nickname}</div>
              <div className="card-container">
                <UserCard user={props.user} {...props} />
              </div>
              <div className="btn-container">
                <ButtonAnt color="default" onClick={() => props.setIsVisibleModalUserCard(false)}>
                  Cerrar
                </ButtonAnt>
              </div>
            </Content>
          </ModalContainer>
        );
    }
  };

  return modalContent();
};

const ContentAward = styled.div`
  .top-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;

    .name {
      font-family: Encode Sans, sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  .first-content {
    .card-container {
      max-width: 200px;
      margin: 1rem auto;
    }
  }

  .second-content {
    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      color: ${(props) => props.theme.basic.blackDarken};
    }

    .awards {
      display: flex;
      flex-direction: column;

      .award-content {
        display: flex;
        align-items: center;
        margin: 0.5rem 0;

        label {
          color: ${(props) => props.theme.basic.blackDarken};
          font-family: Lato;
          font-style: normal;
          font-weight: 500;
          font-size: 13px;
          line-height: 16px;
          margin-left: 5px;
        }
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .main-content-award {
      display: grid;
      grid-template-columns: 2fr 1fr;
      align-items: center;
      grid-gap: 1rem;

      .first-content {
        .card-container {
          max-width: 320px;
          margin: 1rem auto;
        }
      }
    }

    .btns-container {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      margin: 1rem 0;
      flex-direction: row;
    }
  }
`;

const ContainerValidate = styled.div`
  .top-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;

    .btns-container {
      display: flex;
      align-items: center;

      .disqualify {
        font-family: Lato !important;
        font-style: normal !important;
        font-weight: bold !important;
        font-size: 12px !important;
        line-height: 14px !important;
        padding: 5px 10px !important;
        margin: 0 5px !important;
      }
    }

    .name {
      font-family: Encode Sans, sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  .card-container {
    margin: 1rem auto;
  }

  .board-container {
    max-width: 100%;
    overflow: auto;
  }

  .action-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;
  }

  ${mediaQuery.afterTablet} {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-container {
      max-width: 320px;
    }

    .board-container {
      width: 650px;
      max-width: 650px;
    }
  }
`;

const Content = styled.div`
  width: 100%;

  .title-card {
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 33px;
    margin: 1rem;
    color: ${(props) => props.theme.basic.secondary};
    text-align: center;
  }

  .card-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-container {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${mediaQuery.afterTablet} {
    .title-card {
      font-size: 30px;
      line-height: 41px;
    }
  }
`;
