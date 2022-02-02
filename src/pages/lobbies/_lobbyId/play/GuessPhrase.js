import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";

export const GuessPhrase = (props) => {

  const words = props.phrase.split(" ");

  return (
  <GuessPhraseStyled className="max-w-[900px] mx-auto relative">
    {words.map((word, i) => (
      <div key={`word-${i}`} className="inline-block mx-3">
        {word.split("").map((letter, i) =>
          letter === " "
          ? (<span key={`ws-${i}`} className="whitespace">&nbsp;</span>)
          : letter === ","
          ? (<span key={`ws-${i}`} className="text-white leading-6 text-6xl md:text-7xl whitespace">{ letter }</span>)
          : (<div key={`letter-${i}`} className="letter">
              <div className="character">
                {Object.keys(props.lobby.lettersPressed).includes(letter.toUpperCase()) ? letter.toUpperCase() : " "}
              </div>
              <hr className="underscore" />
            </div>)
        )}
        </div>
    ))}
  </GuessPhraseStyled>
)};

const GuessPhraseStyled = styled.div`
text-align: center;
margin-bottom: 60px;

.whitespace {
  margin: 7px;
}

.letter {
  color: ${(props) => props.theme.basic.white};
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 28px;

  margin: 8px 4px;
  min-width: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  vertical-align: bottom;

  .character {
    text-transform: uppercase;
    height: 47px;
    width: 100%;
  }

  .underscore {
    width: 100%;
    height: 2px;
    background: white;
  }

  ${mediaQuery.afterTablet} {
    font-size: 32px;
    min-width: 45px;
    line-height: 47px;
  }
}
`;
