import React from "reactn";
import styled from "styled-components";
import { Anchor } from "../../components/form";
import { useTranslation } from "../../hooks/useTranslation";

export const Landing = () => {

  const { t } = useTranslation();

  return (
    <LadingContainer>
      <Anchor variant="primary" onClick={() => { if (typeof window !== "undefined") window.location.href = "/"; }}>
        {t("ingress")}
      </Anchor>
    </LadingContainer>
  );
};

const LadingContainer = styled.div`
  color: ${(props) => props.theme.basic.white};
`;
