import React from "reactn";
import styled from "styled-components";
import { Anchor } from "../../components/form";
import { useRouter } from "next/router";

export const Lading = () => {
  const router = useRouter();

  return (
    <LadingContainer>
      <Anchor variant="primary" onClick={() => router.push("/login")}>
        INGREGAR
      </Anchor>
    </LadingContainer>
  );
};

const LadingContainer = styled.div`
  color: ${(props) => props.theme.basic.white};
`;
