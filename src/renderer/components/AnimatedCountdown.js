// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";

const WrappedSvg: ThemedComponent<{}> = styled.svg`
  transform: rotate(-90deg);
  border-radius: 50%;
  border: 1px solid ${p => rgba(p.bgColor, 0.25)};
  background-clip: padding-box;
  background: ${p => rgba(p.bgColor, 0.25)};
  & circle {
    fill: ${p => p.fillColor};
    stroke: ${p => p.bgColor};
    stroke-width: 32;
    animation: grow ${p => p.duration}ms infinite linear;
  }

  @keyframes grow {
    from {
      stroke-dasharray: 0 100;
    }
    to {
      stroke-dasharray: 100 100;
    }
  }
`;

const AnimatedCountdown = ({
  size = 10,
  bgColor = "red",
  fillColor = "white",
  duration = 60000,
}: {
  size: number,
  bgColor?: string,
  fillColor?: string,
  duration?: number,
}) => {
  return (
    <WrappedSvg
      width={size}
      height={size}
      duration={duration}
      viewBox={"0 0 32 32"}
      bgColor={bgColor}
      fillColor={fillColor}
    >
      <circle r={16} cx={16} cy={16} />
    </WrappedSvg>
  );
};

export default AnimatedCountdown;
