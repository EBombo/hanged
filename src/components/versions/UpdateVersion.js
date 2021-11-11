import React from "react";
import styled from "styled-components";
import { config } from "../../firebase";
import { Image } from "../common/Image";
import { mediaQuery } from "../../constants";
import { ButtonAnt } from "../form";

const UpdateVersion = () => (
  <UpdateContainer>
    <div className="card">
      <Image
        src={`${config.storageUrl}/resources/${window.location.hostname}.png`}
        alt=""
        width={"96px"}
        height={"26px"}
      />
      <h2 className="title">Por favor actualiza a la última versión de la plataforma</h2>
      <ButtonAnt onClick={() => document.location.reload(true)} fontSize="18px">
        ACTUALIZAR
      </ButtonAnt>
    </div>
  </UpdateContainer>
);

const UpdateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.basic.default};
  height: 100vh;

  .card {
    min-width: 300px;
    width: 80%;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: inherit;

    .title {
      color: ${(props) => props.theme.basic.white};
      font-weight: 500;
      line-height: 19px;
      text-align: center;
      font-size: 15px;

      ${mediaQuery.afterTablet} {
        font-size: 18px;
      }

      padding: 20px 0;
    }
  }
`;

export default UpdateVersion;
