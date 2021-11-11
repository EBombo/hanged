import styled from "styled-components";
import { sizes } from "../../constants";

export const Error = styled.p`
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
