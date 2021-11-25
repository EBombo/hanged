import React from "reactn";
import styled from "styled-components";
import { alphabet } from "../../../../components/common/DataList";
import { ButtonAnt } from "../../../../components/form";

const getColorByLetterState = (lettersPressed, letter) => {
  if (lettersPressed[letter] === "unmatched") return "default";
  if (lettersPressed[letter] === "matched") return "success";
  return "primary";
};

export const Alphabet = (props) => (
  <AlphabetContainer>
    {alphabet.map((letter, i) => (
      <ButtonAnt
        key={`letter-key-${i}`}
        className="letter"
        onClick={() => props.onLetterPressed?.(letter)}
        color={getColorByLetterState(props.lettersPressed, letter)}
        disabled={getColorByLetterState(props.lettersPressed, letter) === "default"}
      >
        {letter}
      </ButtonAnt>
    ))}
  </AlphabetContainer>
);

const AlphabetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .letter {
    margin: 0.3rem;
    padding: 6px 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    min-width: 38px;
    min-height: 38px;
    font-weight: bold;
    font-family: Lato;
    font-style: normal;
  }
`;
