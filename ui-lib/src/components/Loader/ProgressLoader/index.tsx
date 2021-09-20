import React from "react";
import styled from "styled-components";
import Text from "@components/Text";

export interface Props {
  /**
   * Radius of the progress ring.
   */
  radius?: number;

  /**
   * Thickness of the progress ring.
   */
  stroke?: number;

  /**
   * Progress of the loader, in percent, between 0 and 100.
   */
  progress?: number;
}

const StyledCircle = styled.circle.attrs({
  fill: "transparent",
  cx: "50%",
  cy: "50%",
})`
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
`;

const StyledCircleBackground = styled(StyledCircle).attrs((props) => ({
  stroke: props.theme.colors.palette.primary.c20,
}))``;

const StyledCircleFront = styled(StyledCircle).attrs((props) => ({
  stroke: props.theme.colors.palette.primary.c100,
}))``;

const StyledCenteredText = styled(Text).attrs({
  type: "cta",
  color: "palette.primary.c140",
})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const StyledProgressLoaderContainer = styled.div`
  display: flex;
  position: absolute;
`;

function ProgressCircleSvg({
  radius,
  stroke,
  progress,
}: {
  radius: number;
  stroke: number;
  progress: number;
}) {
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2}>
      <StyledCircleBackground
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset: 0 }}
        r={normalizedRadius}
      />
      <StyledCircleFront
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
      />
    </svg>
  );
}

export default function ProgressLoader({
  radius = 32,
  stroke = 6,
  progress = 0,
}: Props): JSX.Element {
  return (
    <StyledProgressLoaderContainer>
      <StyledCenteredText>{progress}%</StyledCenteredText>
      <ProgressCircleSvg radius={radius} stroke={stroke} progress={progress} />
    </StyledProgressLoaderContainer>
  );
}
