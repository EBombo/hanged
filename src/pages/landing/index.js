import React from "reactn";
import styled from "styled-components";
import { Anchor } from "../../components/form";

export const Landing = () => {
  return (
    <LadingContainer>
      <Anchor variant="primary" onClick={() => { if (typeof window !== "undefined") window.location.href = "/"; }}>
        INGREGAR
      </Anchor>
    </LadingContainer>
  );
};

const LadingContainer = styled.div`
  color: ${(props) => props.theme.basic.white};
`;
