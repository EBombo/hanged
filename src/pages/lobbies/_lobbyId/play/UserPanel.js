import { UserCard } from "./UserCard";
import { BingoBoard } from "./BingoBoard";
import { CardPattern } from "./CardPattern";
import { LastBall } from "./LastBall";
import { ButtonAnt } from "../../../../components/form";
import { LastPlays } from "./LastPlays";
import React, { useGlobal, useState } from "reactn";
import defaultTo from "lodash/defaultTo";
import { Chat } from "../../../../components/chat";
import { Desktop, Tablet } from "../../../../constants";

export const UserPanel = (props) => {
  const [authUser] = useGlobal("user");
  const [lastNumber, setLastNumber] = useState(0);

  return (
    <>
      <Desktop>
        <div className="user-content">
          <div className="left-user-content">
            <UserCard user={authUser} {...props} />
            <ButtonAnt
              color="success"
              onClick={() => props.callBingo()}
              disabled={defaultTo(props.lobby.bannedUsersId, []).includes(authUser.id) || !props.lobby.startGame}
            >
              Bingo
            </ButtonAnt>
          </div>
          <div className="right-user-content">
            <div className="board-container">
              <BingoBoard {...props} setLastNumber={setLastNumber} isVisible={props.lobby.settings.showBoardToUser} />
            </div>
            <div className="bottom-section">
              <LastBall lastNumber={lastNumber} vertical {...props} />
              <div className="last-plays-container">
                <LastPlays showMore {...props} />
              </div>
              <div className="pattern">
                <CardPattern caption={"Patrón a completar"} hiddenOptions key={props.lobby.pattern} {...props} />
                {props.lobby.settings.awards?.length && (
                  <ButtonAnt color="default" width="100%" onClick={() => props.setIsVisibleModalAwards(true)}>
                    Ver premios
                  </ButtonAnt>
                )}
              </div>
            </div>
          </div>
        </div>
      </Desktop>
      <Tablet>
        <div className="top-container-user">
          <div className="left-side">
            <div className="pattern">
              <CardPattern key={props.lobby.pattern} caption={"Patrón que se debe llenar"} hiddenOptions {...props} />
            </div>
          </div>
          <div className="right-side">
            <LastBall lastNumber={lastNumber} {...props} />
            <LastPlays {...props} />
          </div>
        </div>
        <div className="bingo-card-container">
          <UserCard user={authUser} {...props} />
        </div>
        <div className="buttons-container">
          <ButtonAnt
            color="success"
            onClick={() => props.callBingo()}
            disabled={defaultTo(props.lobby.bannedUsersId, []).includes(authUser.id) || !props.lobby.startGame}
          >
            Bingo
          </ButtonAnt>
          {props.lobby.settings.awards?.length && (
            <ButtonAnt color="default" margin={"0 0 0 1rem"} onClick={() => props.setIsVisibleModalAwards(true)}>
              Ver premios
            </ButtonAnt>
          )}
        </div>
        <div className="bingo-board">
          <BingoBoard {...props} setLastNumber={setLastNumber} isVisible={props.lobby.settings.showBoardToUser} />
        </div>
        <div className="chat-container">
          <Chat title={"CHAT DEL BINGO"} />
        </div>
      </Tablet>
    </>
  );
};
