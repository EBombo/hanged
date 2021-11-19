import styled from "styled-components";
import React from "react";
import { Image } from "./Image";
import { config } from "../../firebase";

export const Arrows = (props) => {
  return (
    <ContainerArrow position={props.position ? props.position : "center"}>
      {props.showArrows && (
        <Image
          src={`${config.storageUrl}/resources/arrows/left.svg`}
          height="31px"
          width="40px"
          size="contain"
          cursor="pointer"
          onClick={() => {
            props.prev();
            props.slider.current.prev();
          }}
        />
      )}

      {!props.hideDots &&
        props.components.map((_, index) => {
          return (
            <Dot
              indicator={props.indicator}
              index={index}
              key={`carousel-dots-${index}`}
              onClick={() => props.goTo(index)}
            />
          );
        })}

      {props.showArrows && (
        <Image
          src={`${config.storageUrl}/resources/arrows/right.svg`}
          height="31px"
          width="40px"
          size="contain"
          cursor="pointer"
          onClick={() => {
            props.next();
            props.slider.current.next();
          }}
        />
      )}
    </ContainerArrow>
  );
};

const ContainerArrow = styled.div`
  height: 35px;
  position: relative;
  display: flex;
  justify-content: ${(props) =>
    props.position === "center"
      ? "center"
      : props.position === "right"
      ? "flex-end"
      : props.position === "left"
      ? "flex-start"
      : "center"};
  align-items: center;
  margin-bottom: 2rem;
`;

const Dot = styled.span`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin: 0 5px;
  background-color: ${(props) =>
    props.index === props.indicator ? props.theme.basic.primary : props.theme.basic.grayLighten};
`;
