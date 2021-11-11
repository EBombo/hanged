import React, { useGlobal } from "reactn";
import { Slider } from "antd";
import styled from "styled-components";
import { ANIMATION, SPEED } from "../../../../business";

export const SliderControls = () => {
  const [isAutomatic] = useGlobal("isAutomatic");
  const [animationSpeed, setAnimationSpeed] = useGlobal("animationSpeed");
  const [reproductionSpeed, setReproductionSpeed] = useGlobal("reproductionSpeed");

  // TODO: Consider only showing when "isAutomatic" is active.
  //if (!isAutomatic) return null;

  return (
    <SliderControlsCss>
      <div className="slider-auto">
        <div className="description">Vel. animación</div>
        <div>
          <Slider
            onChange={(value) => setAnimationSpeed(value)}
            defaultValue={animationSpeed}
            min={ANIMATION.min}
            max={ANIMATION.max}
          />
        </div>
      </div>
      {isAutomatic && (
        <div className="slider-auto">
          <div className="description">Vel. reproducción</div>
          <div>
            <Slider
              onChange={(value) => setReproductionSpeed(value)}
              defaultValue={reproductionSpeed}
              min={SPEED.min}
              max={SPEED.max}
            />
          </div>
        </div>
      )}
    </SliderControlsCss>
  );
};

const SliderControlsCss = styled.div`
  font-size: 10px;
  padding: 10px 15px;
  color: ${(props) => props.theme.basic.white};

  .description {
    margin: auto 0;
  }

  .slider-auto {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`;
