// @flow

import React from "react";
import styled, { css, keyframes } from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import { lighten } from "~/renderer/styles/helpers";

const STROKE_WIDTH = 4;

type Props = {
  progress: number,
  size: number,
  hideProgress?: boolean,
};

const animIndeterminate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const InnerCircle = styled.circle`
  transform-origin: 50% 50%;
  ${p =>
    p.progress === 0
      ? css`
          animation: ${animIndeterminate} 1s linear infinite;
        `
      : css`
          transition: stroke-dashoffset 0.35s;
          transform: rotate(-90deg);
        `};
`;

const Container: ThemedComponent<{ size: number | string }> = styled.div`
  position: relative;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
`;

const TextContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressCircle = ({ size, progress, hideProgress }: Props) => {
  const radius = size / 2;
  const normalizedRadius = radius - STROKE_WIDTH / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.floor(progress * 100);
  const strokeDashoffset = progress
    ? circumference - progress * circumference
    : 0.9 * circumference;

  return (
    <Container size={size}>
      <TextContainer>
        <Text ff="Inter|SemiBold" color="wallet" fontSize={4}>
          {percent && !hideProgress ? `${percent}%` : ""}
        </Text>
      </TextContainer>
      <svg height={size} width={size}>
        <circle
          stroke={lighten(useTheme("colors.wallet"), 0.2)}
          fill="transparent"
          strokeWidth={STROKE_WIDTH}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <InnerCircle
          progress={progress}
          stroke={useTheme("colors.wallet")}
          fill="transparent"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </Container>
  );
};

export default ProgressCircle;
