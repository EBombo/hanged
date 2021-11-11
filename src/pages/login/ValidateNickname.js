import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { config } from "../../firebase";
import { Image } from "../../components/common/Image";

export const ValidateNickname = (props) => {
  return (
    <ValidatingContainer>
      <div className="title">Verificando tu apodo...</div>
      <Image
        src={`${config.storageUrl}/resources/white_spinner.gif`}
        height="75px"
        width="75px"
        size="contain"
        margin="1rem auto"
      />
    </ValidatingContainer>
  );
};

const ValidatingContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 30px;
  }

  ${mediaQuery.afterTablet} {
    font-size: 36px;
    line-height: 43px;
  }
`;
