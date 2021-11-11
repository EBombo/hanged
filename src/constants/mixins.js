import { colorBlack, colorPrimary, colorRed, colorWhite } from "./colors";
import { mediaQuery } from "./mediaQuery";

export const rgbaPrimary = (opacity) => {
  return `background: rgba(105, 232, 160, ${opacity});`;
};

export const btnPrimary = (fonSize, fontWeight, margin, width, height) => {
  return `display: flex;
          justify-content: center;
          text-align: center;
          align-items: center;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          background: ${colorPrimary.primary};
          color: ${colorBlack.black};
          width: ${width};
          height: ${height};
          font-size: ${fonSize};
          font-weight: ${fontWeight};
          margin: ${margin};`;
};

export const btnPrimaryGeneral = (fonSize, fontWeight, margin, width, height, color, bgColor, borderRadius) => {
  return `display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${borderRadius};
    border: none;
    cursor: pointer;
    text-align: center;
    width: ${width};
    height: ${height};
    font-size: ${fonSize};
    font-weight: ${fontWeight};
    background: ${bgColor}!important;
    color: ${color}!important;
    margin: ${margin};`;
};

export const btnDashed = (fonSize, fontWeight, margin, width, height) => {
  return `display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border-radius: 7px;
            background: none;
            text-align: center;
            border: 1px solid ${colorPrimary.primary};
            color: ${colorWhite.white};
            font-size: ${fonSize};
            font-weight: ${fontWeight};
            margin: ${margin};
            width: ${width};
            height: ${height};`;
};

export const btnDashedLive = (fonSize, fontWeight, margin, width, height) => {
  return `display: flex;
            justify-content: center;
            text-align: center;
            border-radius: 7px;
            background: none;
            border: 1px solid ${colorRed.lighten_2};
            color: ${colorWhite.white};
            cursor: pointer;
            font-size: ${fonSize};
            font-weight: ${fontWeight};
            margin: ${margin};
            width: ${width};
            height: ${height};`;
};

export const moneyBombo = (widthHeight, fontSize, borderSize, borderRadius, colorMoney) => {
  return `padding: 8px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${widthHeight};
            height: ${widthHeight};
            font-size: ${fontSize};
            border-radius: ${borderRadius};
            border: ${borderSize} solid ${colorMoney};
            color: ${colorMoney};`;
};

export const dot = (size, bgColor) => {
  return `border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${size};
    width: ${size};
    background: ${bgColor};`;
};

//HOVER - FOCUS BUTTONS
export const btnPrimaryHoverFocus = (borderColor, colorText, bgColor) => {
  return `&:hover, &:focus {
        border-color: ${borderColor};
        color: ${colorText};
        background: ${bgColor};
    }`;
};

//HOVER - FOCUS SELECTS AND INPUTS
export const selectPrimaryHoverFocus = (borderColor, colorText, bgColor) => {
  return `&:hover, &:focus {
        border-color: ${borderColor};
        color: ${colorText};
        background: ${bgColor};
    }`;
};

export const inputPrimaryHoverFocus = (borderColor, colorText, bgColor) => {
  return `&:hover, &:focus {
        border-color: ${borderColor};
        color: ${colorText};
        background: ${bgColor};
    }`;
};

export const inputPrimaryHoverFocusTwo = (borderColor, colorText, bgColor) => {
  return `&:hover, &:focus {
        border-color: ${borderColor};
        color: ${colorText};
        background: ${bgColor};
        box-shadow: 1px 1px 1px ${borderColor} inset, 1px 1px 1px ${borderColor};
        outline: 0 none;
    }`;
};

//AUTO FILLS SELECT AND INPUTS
export const inputAutoFill = (cursorColor, borderColor, textColor, bgColor) => {
  return `&:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus {
                    caret-color: ${cursorColor};
                    border: 1px solid ${borderColor};
                    -webkit-text-fill-color: ${textColor};
                    -webkit-box-shadow: 0 0 0px 1000px ${bgColor} inset;
                    transition: background-color 5000s ease-in-out 0s;
                }`;
};

export const selectAutoFill = (cursorColor, borderColor, textColor, bgColor) => {
  return `&:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus {
                    caret-color: ${cursorColor};
                    border: 1px solid ${borderColor};
                    -webkit-text-fill-color: ${textColor};
                    -webkit-box-shadow: 0 0 0px 1000px ${bgColor} inset;
                    transition: background-color 5000s ease-in-out 0s;
                }`;
};

//FONT SIZE TABS
export const tabsFontSize = (fontSize) => {
  return `font-size: ${fontSize};`;
};

//FONT WEIGHT FONTS
export const fontWeightFont = (weight) => {
  return `font-family: 'Encode Sans', sans-serif;
    font-weight: ${weight};`;
};

//WALLET BUTTON
export const walletButton = (background, colorOne, colorTwo) => {
  return `width: 100%;
            margin-bottom: 10px;
            display: flex;
            padding: 12px;
            justify-content: space-between;
            align-items: center;
            border-radius: 7px;
            background: ${background};
            cursor: pointer;
            ${mediaQuery.afterMobile} {
                padding: 12px;
            }
        
        .items-one {
            .title-card-wallet {
                color: ${colorOne};
                font-size: 1rem;
                ${fontWeightFont(700)};
                ${mediaQuery.afterMobile} {
                        font-size: 17px;
                        font-weight: 600;
                    }
                }
            }
        
        .items-two {
                color: ${colorTwo} !important;
        
            .icon {
                    color: ${colorTwo} !important;
                    font-size: 18px;
                }
            }`;
};

export const iconCaptainDynamic = (width, height, bgColor, color, fontSize, fontWeight) => {
  return `width:${width};
            height: ${height};
            background: ${bgColor};
            color: ${color};
            font-weight: ${fontWeight};
            font-size: ${fontSize};
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;`;
};

export const centerFlexBox = () => {
  return `display: flex;
        justify-content: center;
        align-items: center;`;
};

export const flexBoxDynamic = (vertical, horizontal) => {
  return `display: flex;
        justify-content: ${horizontal};
        align-items: ${vertical};`;
};
