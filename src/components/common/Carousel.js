import React, { useRef, useState } from "react";
import { Carousel as CarouselAntd } from "antd";
import styled from "styled-components";
import { Arrows } from "./arrowsCarousel";

export const Carousel = (props) => {
  const slider = useRef(null);

  const [indicator, setIndicator] = useState(0);
  const [lengthComponents] = useState(props.components.length);

  const next = () => {
    if (indicator + 1 > lengthComponents - 1) {
      setIndicator(0);
      return props.setIndex && props.setIndex(0);
    }

    setIndicator(indicator + 1);
    props.setIndex && props.setIndex(indicator + 1);
  };

  const prev = () => {
    if (indicator - 1 < 0) {
      setIndicator(lengthComponents - 1);
      return props.setIndex && props.setIndex(lengthComponents - 1);
    }

    setIndicator(indicator - 1);
    props.setIndex && props.setIndex(indicator - 1);
  };

  const goTo = (slideNumber) => {
    setIndicator(slideNumber);
    slider.current.goTo(slideNumber, true);
  };

  return (
    <Container width={props.width} height={props.height}>
      <CarouselStyled
        ref={slider}
        dots={false}
        autoplay={!!props.autoplay}
        afterChange={(current) => setIndicator(current)}
        width={props.width}
        height={props.height}
      >
        {props.components.map((component, index) => (
          <div className="content-carousel" key={index}>
            {component}
          </div>
        ))}
      </CarouselStyled>
      {!props.hideIndicators && (
        <Arrows slider={slider} next={next} prev={prev} indicator={indicator} goTo={goTo} {...props} />
      )}
    </Container>
  );
};

const Container = styled.div`
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "100%")};
  max-width: 100%;
  overflow: hidden;
  color: ${(props) => props.theme.basic.white};
  .slider-decorator-0 {
    bottom: -20px !important;
  }
`;

const CarouselStyled = styled(CarouselAntd)`
  .content-carousel {
    width: ${(props) => (props.width ? props.width : "auto")};
    height: ${(props) => (props.height ? `calc(${props.height} - 20px)` : "100%")};
    padding: 10px 20px;
  }

  .am-carousel-wrap {
    .am-carousel-wrap-dot-active {
      span {
        background-color: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;
