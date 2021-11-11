import React, { useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

export const Winner = (props) => {
  const [award, setAward] = useState(null);

  return (
    <WinnerCss award={award} isList={props.isList}>
      {!props.isList && (
        <Image
          src={`${config.storageUrl}/resources/icon-${props.index + 1}.svg`}
          height="100px"
          width="100px"
          desktopHeight="130px"
          desktopWidth="130px"
          zIndex="2"
          margin="auto"
        />
      )}
      <div className="details">
        <div className="tab" onClick={() => setAward(award ? null : props.winner.award.name)}>
          {props.winner.nickname} {award ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </div>
        {award && <div className="award">{award}</div>}
      </div>
    </WinnerCss>
  );
};

const WinnerCss = styled.div`
  display: grid;
  margin: ${(props) => (props.isList ? "5px auto" : "20px auto")};
  ${(props) => (props.isList ? "" : "grid-template-columns: 150px 4fr;")}

  .details {
    display: grid;
    margin-top: ${(props) => (props.award ? "30px" : "-")};

    .tab {
      z-index: 1;
      display: flex;
      cursor: pointer;
      font-size: 1.5rem;
      height: fit-content;
      padding: 10px 10px 10px 3rem;
      border-radius: 10px 10px 10px 10px;
      color: ${(props) => props.theme.basic.black};
      background: ${(props) => props.theme.basic.white};
      margin: auto 0 auto ${(props) => (props.isList ? "0" : "-50px")};

      .anticon {
        color: ${(props) => props.theme.basic.secondary};
        margin: auto 0 auto auto;
      }
    }

    .award {
      font-size: 1rem;
      margin: -10px 0 auto ${(props) => (props.isList ? "0" : "-30px")};
      border-radius: 0 0 5px 5px;
      padding: 15px 15px 15px 3rem;
      color: ${(props) => props.theme.basic.secondary};
      background: ${(props) => props.theme.basic.grayLighten};
    }
  }
`;
