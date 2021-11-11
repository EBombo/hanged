import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";

export const Image = (props) => (
  <ImageCss {...props}>
    <img src={props.src} alt={props.src} />
  </ImageCss>
);

const ImageCss = styled.div`
  background-image: url("${(props) => props.src}");
  background-repeat: no-repeat;
  background-position: ${(props) => props.bgposition || "center"};
  background-size: ${(props) => (props.size ? props.size : "100%")};
  height: ${(props) => (props.height ? props.height : "100%")};
  width: ${(props) => (props.width ? props.width : "100%")};
  margin: ${(props) => props.margin || "auto"};
  cursor: ${(props) => props.cursor || "default"};
  ${(props) => (props.opacity ? "background-color: rgba(0,0,0,0.3);" : "")}
  filter: ${(props) => (props.filter ? props.filter : "none")};
  ${(props) => (props.zIndex ? `z-index:${props.zIndex};` : "")}

  ${mediaQuery.afterMobile} {
    height: ${(props) => (props.desktopHeight ? props.desktopHeight : props.height)};
    width: ${(props) => (props.desktopWidth ? props.desktopWidth : props.width)};
  }

  img {
    width: 100%;
    height: auto;
    visibility: hidden;
  }
`;
