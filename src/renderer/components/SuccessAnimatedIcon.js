// @flow

import React, { PureComponent } from "react";
import styled, { keyframes } from "styled-components";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const scaleAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(1.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const drawCircle = keyframes`
  0% {
    stroke-dashoffset: 151px;
  }
  100% {
    stroke-dashoffset: 0;
   
  }
`;

const drawCheck = keyframes`
  0% {
    stroke-dashoffset: 36px;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
        stroke: #66BE54;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const SuccessLogoContainer: ThemedComponent<{ width: number }> = styled(Box).attrs(() => ({
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
}))`
  width: ${p => `${p.width}px`};
  height: ${p => `${p.width}px`};

  & > svg {
    animation: 1s ease-out 0s 1 both ${scaleAnimation};

    & > path {
      fill: rgba(102, 190, 84, 0.3);
      stroke: #66be54;
      background: #66be54;
      stroke-width: 2;
      opacity: 0;
      animation: 0.3s linear 0.9s both ${fadeIn};
    }

    & > circle {
      stroke-dasharray: 151px, 151px;
      stroke: #66be54;
      animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both ${drawCircle},
        0.3s linear 0.9s 1 both ${fadeOut};
    }

    & > polyline {
      stroke-dasharray: 151px, 151px;
      stroke: #66be54;
      animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both ${drawCheck},
        0.3s linear 0.9s 1 both ${fadeOut};
    }
  }
`;

type Props = {
  width: number,
  height: number,
};
class SuccessAnimatedIcon extends PureComponent<Props> {
  render() {
    const { width = 80, height = 80, ...p } = this.props;
    return (
      <SuccessLogoContainer {...p} width={width} height={height}>
        <svg
          className="animated"
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          <path
            fill="#D8D8D8"
            d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"
          />
          <circle
            cx="35"
            cy="35"
            r="24"
            stroke="#979797"
            strokeWidth="2"
            strokeLinecap="round"
            fill="transparent"
          />
          <polyline
            stroke="#66BE54"
            strokeWidth="2"
            points="23 34 34 43 47 27"
            fill="transparent"
          />
        </svg>
      </SuccessLogoContainer>
    );
  }
}

export default SuccessAnimatedIcon;
