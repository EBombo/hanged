import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { ButtonAnt } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";
import { firestore } from "../../../../firebase";
import { generateMatrix } from "../../../../business";

export const CardPattern = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pattern, setPattern] = useState(generateMatrix());
  const [authUser] = useGlobal("user");

  useEffect(() => {
    if (props.apagon) return setPattern(generateMatrix(true));

    if (props.lobby.pattern) return setPattern(JSON.parse(props.lobby.pattern));
  }, [props.lobby.pattern, props.apagon]);

  const editPattern = (row, col) => {
    const newPattern = [...pattern];
    newPattern[row][col] = newPattern[row][col] ? null : true;
    setPattern(newPattern);
  };

  const savePattern = async () => {
    setIsLoading(true);

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      pattern: JSON.stringify(pattern),
      updateAt: new Date(),
    });

    if (props.continueGame) await props.continueGame();

    setIsLoading(false);
  };

  return (
    <PatternContainer user={authUser} isEdit={props.isEdit}>
      <div className="caption">{props.caption}</div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{get(props, "lobby.game.letters.b")}</th>
              <th>{get(props, "lobby.game.letters.i")}</th>
              <th>{get(props, "lobby.game.letters.n")}</th>
              <th>{get(props, "lobby.game.letters.g")}</th>
              <th>{get(props, "lobby.game.letters.o")}</th>
            </tr>
          </thead>
          <tbody>
            {pattern.map((element, index) => (
              <tr key={index}>
                {element.map((value, index_) => (
                  <td
                    onClick={() => {
                      if (!props.isEdit) return;
                      editPattern(index, index_);
                    }}
                    key={`${pattern}-${index}-${index_}`}
                  >
                    <div className={`${value ? "selected" : "empty"}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!props.isEdit && !props.hiddenOptions && (
        <div className="btns-container">
          <ButtonAnt
            onClick={() => {
              props.setApagon(true);
              props.setIsVisibleModalPattern(true);
            }}
          >
            Apágon
          </ButtonAnt>
          <ButtonAnt
            color="default"
            onClick={() => {
              props.setApagon(false);
              props.setIsVisibleModalPattern(true);
            }}
          >
            Editar
          </ButtonAnt>
        </div>
      )}
      {props.isEdit && !props.hiddenOptions && (
        <div className="btns-container">
          <ButtonAnt color="success" loading={isLoading} onClick={() => savePattern()}>
            Guardar
          </ButtonAnt>
          <ButtonAnt
            color="default"
            disabled={isLoading}
            onClick={() => {
              if (props.apagon) props.setApagon(false);
              props.cancelAction();
            }}
          >
            Cancelar
          </ButtonAnt>
        </div>
      )}
    </PatternContainer>
  );
};

const PatternContainer = styled.div`
  width: 100%;
  max-width: 220px;
  .caption{
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    color: ${(props) => props.theme.basic.white};
    text-align: center;
  }

  .table-container {
    margin: 0.5rem 0;
    
    table {
      border-collapse: separate;
      border-spacing: 5px;
      margin: auto;
      background: transparent;
      border-radius: 5px;
      
      th {
        font-family: Encode Sans;
        font-style: normal;
        font-weight: bold;
        width: 25px;
        height: 25px;
        font-size: 14px;
        line-height: 18px;
        background: transparent;
        color: ${(props) => props.theme.basic.white};
        border-radius: 3px;
      }

      td {
        width: 25px;
        height: 25px;
        background: ${(props) => props.theme.basic.secondaryDarken};
        border-radius: 3px;
        position: relative;
        cursor: ${(props) => (props.isEdit ? "pointer" : "default")};

        .selected {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: ${(props) => props.theme.basic.whiteDark};
        }
      }

      .empty {
        background: transparent;
      }
    }
  }
  
  .btns-container{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    
    button {
      width: 80%;
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 18px;
    }
  }
  
  ${mediaQuery.afterTablet}{
    max-width: 260px;

    .btns-container{
      flex-direction: ${(props) => (props.isEdit ? "column" : "row")};

      button {
        width: ${(props) => (props.isEdit ? "100%" : "auto")};
        margin-bottom: ${(props) => (props.isEdit ? "1rem" : "0")};
      }
    }
    
    .caption{
      font-size: 14px;
      line-height: 16px;
    }
    
    .table-container {
      
      table {
        border-spacing: 5px;

        th {
          width: ${(props) => (!props.user.isAdmin ? "25px" : "35px")};
          height: ${(props) => (!props.user.isAdmin ? "25px" : "35px")};
          font-size: ${(props) => (!props.user.isAdmin ? "14px" : "26px;")};
          line-height: ${(props) => (!props.user.isAdmin ? "18px" : "32px")};
        }

        td {
          width: ${(props) => (!props.user.isAdmin ? "25px" : "35px")};
          height: ${(props) => (!props.user.isAdmin ? "25px" : "35px")};
          font-size: 26px;
          line-height: 32px;

          .selected {
            width: ${(props) => (!props.user.isAdmin ? "15px" : "20px")};
            height: ${(props) => (!props.user.isAdmin ? "15px" : "20px")};
          }
        }
      }
    }
  }
  }
`;
