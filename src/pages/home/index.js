import React, { useGlobal } from "reactn";
import styled from "styled-components";

export const Home = () => {
  const [authUser] = useGlobal("user");

  return <HomeCss>{authUser?.name}</HomeCss>;
};

const HomeCss = styled.div`
  color: ${(props) => props.theme.basic.white};
`;
