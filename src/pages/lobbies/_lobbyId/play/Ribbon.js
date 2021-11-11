import React from "reactn";
import styled from "styled-components";
import { colorBlack, colorPrimary, mediaQuery } from "../../../../constants";

export const Ribbon = (props) => (
  <RibbonCss {...props}>
    <div className="ribbon-front">
      <div className="upper-line" />
      {props.title}
      <div className="lower-line" />
    </div>
    <div className="ribbon-edge-topleft" />
    <div className="ribbon-edge-topright" />
    <div className="ribbon-edge-bottomleft" />
    <div className="ribbon-edge-bottomright" />
  </RibbonCss>
);

const computeStyleWidth = (ribbonCurrentOverflowWidth) => `
  .ribbon-front {
    width: calc(100% + ${ribbonCurrentOverflowWidth}px);
    left:-${ribbonCurrentOverflowWidth / 2}px;
  }

  .ribbon-edge-topleft,
  .ribbon-edge-bottomleft {
      left: -${ribbonCurrentOverflowWidth / 2}px;
  }
  .ribbon-edge-bottomleft {
    border-width: 15px 0px 0px ${ribbonCurrentOverflowWidth / 2}px;
  }
  
  .ribbon-edge-topright,
  .ribbon-edge-bottomright {
    right: -${ribbonCurrentOverflowWidth / 2}px;
  }
  
  .ribbon-edge-topright {
    border-width: 0px 0 0 ${ribbonCurrentOverflowWidth / 2}px;
  }
  .ribbon-edge-bottomright {
    border-width: 0 0 15px ${ribbonCurrentOverflowWidth / 2}px;
  }
`;

const RibbonCss = styled.div`
  position: relative;
  z-index: 998;
  width: 100%;

  .ribbon-front {
    color: ${() => colorBlack.lighten_5};
    background: linear-gradient(180deg, #56eea5 0%, #36c27f 100%);
    position: relative;
    z-index: 2;
    text-align: center;
    text-shadow: 0px 1px 2px ${() => colorBlack.lighten_5};

    font-family: Lato;
    font-style: normal;
    font-weight: 900;
    font-size: 64px;
    line-height: 117px;

    & .upper-line,
    .lower-line {
      position: absolute;
      background: white;
      height: 4px;
      left: 0;
      right: 0;
    }
    & .upper-line {
      top: 10px;
    }
    & .lower-line {
      bottom: 10px;
    }
  }

  .ribbon-front,
  .ribbon-back-left,
  .ribbon-back-right {
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.55);
  }

  .ribbon-edge-topleft,
  .ribbon-edge-topright,
  .ribbon-edge-bottomleft,
  .ribbon-edge-bottomright {
    position: absolute;
    z-index: 1;
    border-style: solid;
    height: 0px;
    width: 0px;
  }

  .ribbon-edge-topleft,
  .ribbon-edge-topright {
  }

  .ribbon-edge-bottomleft,
  .ribbon-edge-bottomright {
    bottom: -15px;
  }

  .ribbon-edge-topleft,
  .ribbon-edge-bottomleft {
    border-color: transparent ${() => colorPrimary.darken_7} transparent transparent;
  }
  .ribbon-edge-topleft {
    top: -5px;
    border-width: 5px 10px 0 0;
    border-color: transparent transparent transparent transparent;
  }
  .ribbon-edge-bottomleft {
    border-color: ${() => colorPrimary.darken_7} transparent transparent transparent;
  }
  .ribbon-edge-topright,
  .ribbon-edge-bottomright {
    border-color: transparent transparent transparent ${() => colorPrimary.darken_7};
  }
  top: ${(props) => props.title}px;
  ${(props) => computeStyleWidth(props.overflowWidth)}

  ${mediaQuery.afterTablet} {
    ${(props) => computeStyleWidth(props.overflowDesktopWidth)}

    .ribbon-front {
      font-size: 96px;
      line-height: 167px;
    }
  }
`;
