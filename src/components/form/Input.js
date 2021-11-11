import React, { forwardRef, useEffect, useState } from "reactn";
import styled from "styled-components";
import { sizes } from "../../constants";
import { EyeInvisibleOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { config } from "../../firebase";
import { Image } from "../common/Image";

export const Input = forwardRef((props, ref) => {
  const [hide, setHide] = useState(false);

  const inputType = () => {
    if (props.type === "password") return hide ? "password" : "text";

    return props.type;
  };

  useEffect(() => {
    if (props.type === "password") setHide(true);
  }, [props.type]);

  return (
    <InputContainer>
      <InputWrapper {...props} className="input-wrapper">
        <StyledInput
          hasError={props.error}
          {...props}
          ref={ref}
          type={inputType()}
          className={`ant-input ${props.className}`}
        />
        {props.type === "password" && (
          <>
            {hide ? (
              <EyeOutlinedCss onClick={() => setHide(!hide)} />
            ) : (
              <EyeInvisibleOutlinedCss onClick={() => setHide(!hide)} />
            )}
          </>
        )}
        {props.type === "search" && <SearchOutlinedCss onClick={() => props.onPressEnter()} />}
      </InputWrapper>
      {props.error && (
        <Error>
          <Image src={`${config.storageUrl}/resources/error.svg`} height="11px" width="11px" margin="0 5px 0 0" />
          {props.error.message}
        </Error>
      )}
    </InputContainer>
  );
});

const InputContainer = styled.div`
  width: 100%;
  margin: 0;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SearchOutlinedCss = styled(SearchOutlined)`
  z-index: 99;
  position: absolute;
  right: 10px;
  bottom: auto;

  svg {
    color: ${(props) => props.theme.basic.blackDarken} !important;
    font-size: 20px !important;
  }
`;

const EyeOutlinedCss = styled(EyeOutlined)`
  z-index: 99;
  position: absolute;
  right: 5px;
  bottom: auto;

  svg {
    color: ${(props) => props.theme.basic.grayLighten} !important;
  }
`;

const EyeInvisibleOutlinedCss = styled(EyeInvisibleOutlined)`
  z-index: 99;
  position: absolute;
  right: 5px;
  bottom: auto;

  svg {
    color: ${(props) => props.theme.basic.grayLighten} !important;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  height: ${(props) => (props.height ? props.height : "36px")};
  border: 1px solid ${(props) => props.theme.basic.grayLighten};
  box-sizing: border-box;
  border-radius: 4px !important;
  background: ${(props) => props.theme.basic.whiteLight};
  color: ${(props) => props.theme.basic.blackDarken};

  &:focus {
    outline: none;
    border: none;
  }
`;

const Error = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${sizes.font.mini};
  color: ${(props) => props.theme.basic.danger};
`;
