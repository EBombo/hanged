import React from "reactn";
import styled from "styled-components";

export const HangedMan = (props) => (
  <HangedManContainer>
    <div className="inner-content w-[240px] relative">
      <svg viewBox="0 0 164 189" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="180.484" width="163.973" height="7.9709" rx="3.98545" fill="#A18ED7" />
        <path
          d="M22.774 155.447C22.774 153.238 24.5648 151.447 26.774 151.447H49.5189C51.728 151.447 53.5189 153.238 53.5189 155.447V180.484H22.774V155.447Z"
          fill="#666666"
        />
        <path
          d="M34.161 3.98545C34.161 1.78435 35.9454 0 38.1465 0C40.3476 0 42.1319 1.78435 42.1319 3.98545V151.447H34.161V3.98545Z"
          fill="#404040"
        />
        <path
          d="M147.462 7.97089C149.663 7.97089 151.447 6.18654 151.447 3.98544C151.447 1.78433 149.663 -1.62125e-05 147.462 -1.62125e-05L38.161 -1.62125e-05C35.9519 -1.62125e-05 34.161 1.79084 34.161 3.99998V7.97089L147.462 7.97089Z"
          fill="#404040"
        />
        <path d="M85.4606 7.97089H96.7895L42.1319 62.6285L42.1319 51.3002L85.4606 7.97089Z" fill="#666666" />
        <path
          d="M130.951 7.97089H139.491V13.0805C139.491 15.2896 137.7 17.0805 135.491 17.0805H134.951C132.741 17.0805 130.951 15.2896 130.951 13.0805V7.97089Z"
          fill="#242424"
        />
        <rect
          className={`trunk ${props.hangedMan.trunk}`}
          x="131.258"
          y="54.9966"
          width="7.33288"
          height="65.9959"
          rx="3.66644"
          fill="#C4ADFF"
        />
        <rect
          className={`right-arm ${props.hangedMan.rightArm}`}
          x="129.812"
          y="70.5422"
          width="7.9709"
          height="40.3785"
          rx="3.98545"
          transform="rotate(-45 129.812 70.5422)"
          fill="#C4ADFF"
        />
        <rect
          className={`left-arm ${props.hangedMan.leftArm}`}
          width="7.9709"
          height="40.3785"
          rx="3.98545"
          transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 140.087 70.5422)"
          fill="#C4ADFF"
        />
        <rect
          className={`right-leg ${props.hangedMan.rightLeg}`}
          x="130.381"
          y="116.147"
          width="7.9709"
          height="51.2415"
          rx="3.98545"
          transform="rotate(-30 130.381 116.147)"
          fill="#C4ADFF"
        />
        <rect
          className={`left-leg ${props.hangedMan.leftLeg}`}
          width="7.9709"
          height="51.2415"
          rx="3.98545"
          transform="matrix(-0.866025 -0.5 -0.5 0.866025 139.562 116.147)"
          fill="#C4ADFF"
        />
        <path
          className={`head ${props.hangedMan.head}`}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M134.925 60.1296C147.074 60.1296 156.924 50.2805 156.924 38.131C156.924 25.9814 147.074 16.1323 134.925 16.1323C122.775 16.1323 112.926 25.9814 112.926 38.131C112.926 50.2805 122.775 60.1296 134.925 60.1296ZM134.925 53.53C143.43 53.53 150.324 46.6356 150.324 38.1309C150.324 29.6263 143.43 22.7319 134.925 22.7319C126.42 22.7319 119.526 29.6263 119.526 38.1309C119.526 46.6356 126.42 53.53 134.925 53.53Z"
          fill="#C4ADFF"
        />
      </svg>
    </div>
  </HangedManContainer>
);

const HangedManContainer = styled.div`
  text-align: center;
  padding: 32px 0 16px 0;

  .inner-content {
    display: inline-block;
  }

  .hidden {
    &.head,
    &.left-leg,
    &.right-leg,
    &.left-arm,
    &.right-arm,
    &.trunk {
      fill: transparent;
    }
  }
`;
