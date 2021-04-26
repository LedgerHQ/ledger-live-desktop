// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const WrappedSvg: ThemedComponent<{}> = styled.svg`
  transform: rotate(-90deg);
  border-radius: 50%;
  background-clip: padding-box;
`;

const AnimatedCountdown = ({
  size = 10,
  bgColor = "#8A9199",
  fillColor = "white",
  duration = 60000,
}: {
  size: number,
  bgColor?: string,
  fillColor?: string,
  duration?: number,
}) => {
  return (
    <WrappedSvg bgColor={bgColor} width={size} height={size} viewBox={"0 0 32 32"}>
      <circle r={16} cx={16} cy={16} strokeWidth={32} fill={fillColor} stroke={bgColor}>
        {process.env.SPECTRON_RUN ? null : (
          <animate
            attributeName="stroke-dasharray"
            from="0 100"
            to="100 100"
            repeatCount="1"
            dur="60s"
          />
        )}
      </circle>
      <circle r={16} cx={16} cy={16} strokeWidth={8} fill="none" stroke={bgColor} />
    </WrappedSvg>
  );
};

export default AnimatedCountdown;
