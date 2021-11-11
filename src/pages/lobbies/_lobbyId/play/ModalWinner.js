import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import get from "lodash/get";
import { ButtonAnt } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { Ribbon } from "./Ribbon";

export const ModalWinner = (props) => {
  const [authUser] = useGlobal("user");

  return (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      closable={false}
      topDesktop="20%"
      visible={props.isVisibleModalWinner}
      padding="2rem 0rem"
    >
      <WinnerContainer>
        <Ribbon title="¡BINGO!" overflowDesktopWidth={70} overflowWidth={10} />
        <div className="name">{get(props, "winner.nickname", "")}</div>
        {authUser.isAdmin ? (
          <div className="btn-container">
            <ButtonAnt
              color="primary"
              onClick={() => {
                props.setUser(props.winner);
                props.setIsVisibleModalUserCard(true);
                props.setIsVisibleModalWinner(false);
              }}
            >
              Ver cartilla
            </ButtonAnt>
          </div>
        ) : (
          <div className="user-waiting">
            <Image
              src={`${config.storageUrl}/resources/spinner.gif`}
              height="75px"
              width="75px"
              size="contain"
              margin="auto"
            />
            <div className="description">Esperando que el administrador continúe el juego...</div>
          </div>
        )}
      </WinnerContainer>
    </ModalContainer>
  );
};

const WinnerContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: 900;
    font-size: 64px;
    line-height: 77px;
    color: ${(props) => props.theme.basic.secondary};
  }

  .name {
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 33px;
    margin: 30px auto;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  .user-waiting {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  .btn-container {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap-reverse;

    & ButtonAnt {
      display: inline-block;
      margin: 0.5rem 0.5rem;
      min-width: 150px;
    }
  }

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 96px;
      line-height: 115px;
    }

    .name {
      font-size: 36px;
      line-height: 49px;
    }
  }
`;
