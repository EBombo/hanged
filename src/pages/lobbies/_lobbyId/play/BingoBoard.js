import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";
import get from "lodash/get";
import { timeoutPromise } from "../../../../utils/promised";
import { getHead } from "../../../../business";
import { useInterval } from "../../../../hooks/useInterval";

export const BingoBoard = (props) => {
  const [animationSpeed] = useGlobal("animationSpeed");

  const [posY, setPosY] = useState(-1);
  const [posX, setPosX] = useState(-1);
  const [startEffectHead, setStartEffectHead] = useState(false);
  const [startEffectBody, setStartEffectBody] = useState(false);

  const [currentBoard, setCurrentBoard] = useState(props.lobby.board ?? {});

  useEffect(() => {
    //animation
    if (props.isView) return setCurrentBoard(props.lobby.board ?? {});
    if (!props.lobby.board) return setCurrentBoard({});
    if (JSON.stringify(currentBoard) === JSON.stringify(props.lobby.board)) return;

    const initialize = async () => {
      if (!props.lobby.lastPlays[0]) return setCurrentBoard({});

      const lastPlays = [...props.lobby.lastPlays];
      const lastNumber = lastPlays[0];

      const position = getHead(lastNumber);

      const positionOnScreenY = position?.index ?? 0;
      setStartEffectHead(true);
      await timeoutPromise((animationSpeed / 2) * 1000);
      setStartEffectHead(false);
      setPosY(positionOnScreenY);

      const positionOnScreenX = lastNumber;
      setPosX(position.min);
      setStartEffectBody(true);
      await timeoutPromise((animationSpeed / 2) * 1000);
      setStartEffectBody(false);
      setPosX(positionOnScreenX);

      setCurrentBoard(props.lobby.board);
      props.setLastNumber && props.setLastNumber(props.lobby?.lastPlays?.[0] ?? 0);
    };

    initialize();
  }, [props.lobby.board]);

  const effectY = () => setPosY(posY + (posY < 5 ? 1 : -5));
  useInterval(effectY, startEffectHead ? animationSpeed * 50 : null);

  const effectX = () => {
    const max = posX + 15;
    setPosX(posX + (posX < max ? 1 : -15));
  };
  useInterval(effectX, startEffectBody ? animationSpeed * 50 : null);

  const range = (start, end) =>
    Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);

  if (!props.isVisible) return null;

  return (
    <BoardContainer>
      <table className="board">
        <thead>
          <tr>
            <th className={`th-header  ${posY === 0 ? "activey" : ""}`}>{get(props, "lobby.game.letters.b", "B")}</th>
          </tr>
          <tr>
            <th className={`th-header ${posY === 1 ? "activey" : ""}`}>{get(props, "lobby.game.letters.i", "I")}</th>
          </tr>
          <tr>
            <th className={`th-header ${posY === 2 ? "activey" : ""}`}>{get(props, "lobby.game.letters.n", "N")}</th>
          </tr>
          <tr>
            <th className={`th-header ${posY === 3 ? "activey" : ""}`}>{get(props, "lobby.game.letters.g", "G")}</th>
          </tr>
          <tr>
            <th className={`th-header ${posY === 4 ? "activey" : ""}`}>{get(props, "lobby.game.letters.o", "O")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {range(1, 15).map((number) => (
              <td
                className={`td-numbers ${posX === number ? "activex" : ""} ${currentBoard[number] && `active`} ${
                  number === props.lastNumber && `last-number`
                }`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(16, 30).map((number) => (
              <td
                className={`td-numbers ${posX === number ? "activex" : ""} ${currentBoard[number] && `active`} ${
                  number === props.lastNumber && `last-number`
                }`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(31, 45).map((number) => (
              <td
                className={`td-numbers ${posX === number ? "activex" : ""} ${currentBoard[number] && `active`} ${
                  number === props.lastNumber && `last-number`
                }`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(46, 60).map((number) => (
              <td
                className={`td-numbers ${posX === number ? "activex" : ""} ${currentBoard[number] && `active`} ${
                  number === props.lastNumber && `last-number`
                }`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(61, 75).map((number) => (
              <td
                className={`td-numbers ${posX === number ? "activex" : ""} ${currentBoard[number] && `active`} ${
                  number === props.lastNumber && `last-number`
                }`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </BoardContainer>
  );
};

const BoardContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  table {
    display: flex;
    background: ${(props) => props.theme.basic.secondary};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);

    thead {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      background: ${(props) => props.theme.basic.secondaryDarken};
      border-radius: 3px;
      width: 10%;
      max-width: 70px;

      tr {
        z-index: 2;

        .th-header {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: Encode Sans, sans-serif;
          font-style: normal;
          color: ${(props) => props.theme.basic.primaryLight};
          font-weight: bold;
          font-size: 1rem;
          line-height: 15px;
          margin: 0;

          ${mediaQuery.afterTablet} {
            font-size: 1.5rem;
          }
        }

        .activey {
          color: ${(props) => props.theme.basic.success};
        }
      }
    }

    tbody {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      width: 90%;

      tr {
        z-index: 2;
        display: grid;
        grid-template-columns: repeat(15, 1fr);
        grid-gap: 2px;
        margin: 3px;

        .td-numbers {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          color: ${(props) => props.theme.basic.secondary};
          background: ${(props) => props.theme.basic.secondaryDarken};
          box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.25);
          font-size: 10px;
          line-height: 15px;
          height: 20px;
        }

        .active {
          background: ${(props) => props.theme.basic.primary};
          color: ${(props) => props.theme.basic.whiteDark};

          &.last-number {
            background: ${(props) => props.theme.basic.success};
            color: ${(props) => props.theme.basic.black};
          }
        }

        .activex {
          color: ${(props) => props.theme.basic.white};
        }
      }
    }
  }

  ${mediaQuery.afterTablet} {
    margin: 0;

    table {
      thead {
        .th-header {
          font-size: 26px;
          line-height: 30px;
        }
      }

      tbody {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        tr {
          margin: 5px;

          .td-numbers {
            height: 43px;
            font-size: 20px;
            line-height: 26px;
          }
        }
      }
    }
  }
`;
