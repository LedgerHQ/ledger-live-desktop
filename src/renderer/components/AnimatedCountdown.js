// @flow

import React, { memo } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const WrappedSvg: ThemedComponent<{}> = styled.svg`
  transform: rotate(-90deg);
  border-radius: 50%;
  background-clip: padding-box;
`;

type Props = {
  size: number,
  bgColor?: string,
  fillColor?: string,
  duration?: number,
};

const AnimatedCountdown = ({
  size = 10,
  bgColor = "#8A9199",
  fillColor = "white",
  duration = 60000,
}: Props) => {
  return (
    <WrappedSvg bgColor={bgColor} width={size} height={size} viewBox={"0 0 32 32"}>
      <circle r={16} cx={16} cy={16} strokeWidth={32} fill={fillColor} stroke={bgColor}>
        {process.env.PLAYWRIGHT_RUN ? null : (
          <animate
            attributeName="stroke-dasharray"
            from="0 100"
            to="100 100"
            repeatCount="1"
            dur={`${duration}ms`}
          />
        )}
      </circle>
      <circle r={16} cx={16} cy={16} strokeWidth={8} fill="none" stroke={bgColor} />
    </WrappedSvg>
  );
};

export default memo<Props>(AnimatedCountdown);
