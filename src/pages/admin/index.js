import React from "reactn";
import styled from "styled-components";
import Link from "next/link";
import { useAcl } from "../../hooks";
import { adminMenus } from "../../components/common/DataList";
import { sizes } from "../../constants";

export const AdminPage = () => {
  const { aclMenus } = useAcl();

  return (
    <WelcomeContainer>
      <div className="title">Bienvenido Administrador</div>
      <div className="list-subtitle">Lista de permisos otorgados</div>
      <ul>
        {aclMenus({ menus: adminMenus }).map((menu) => (
          <li key={menu.url}>
            <Link href={menu.url}>
              <span>{menu.value}</span>
            </Link>
          </li>
        ))}
      </ul>
    </WelcomeContainer>
  );
};

const WelcomeContainer = styled.div`
  width: 100%;
  color: ${(props) => props.theme.basic.white};

  .title {
    margin: 1rem 0;
    text-align: center;
    font-size: ${sizes.font.normal};
    font-weight: bold;
  }

  .list-subtitle {
    margin: 1rem 0;
    text-align: left;
    font-size: ${sizes.font.normal};
    font-weight: bold;
  }

  ul {
    li {
      cursor: pointer;
      list-style-position: inside;
      font-size: ${sizes.font.normal};
      color: ${(props) => props.theme.basic.white};

      span {
        color: ${(props) => props.theme.basic.white};
      }
    }
  }
`;
