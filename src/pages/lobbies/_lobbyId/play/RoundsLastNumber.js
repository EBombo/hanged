import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";
import defaultTo from "lodash/defaultTo";

export const RoundsLastNumber = (props) => {
  return (
    <Container>
      <div className="item">
        <div className="number">{props.lobby?.round || 0}</div>
        <div className="description">Número de rondas</div>
      </div>
      <div className="item">
        <div className="number">{defaultTo(props.lobby.lastPlays, []).length > 0 ? props.lobby.lastPlays[0] : 0}</div>
        <div className="description">Jugada anterior</div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.basic.blackDarken};
  padding: 0.5rem 0;
  border-radius: 5px;
  width: 125px;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    .number {
      font-size: 60px;
      line-height: 75px;
      color: ${(props) => props.theme.basic.primary};
    }

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.whiteLight};
    }
  }

  ${mediaQuery.afterTablet} {
    width: 275px;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    .item {
      .number {
        font-size: 70px;
        line-height: 85px;
      }

      .description {
        font-size: 13px;
        line-height: 16px;
      }
    }
  }
`;
