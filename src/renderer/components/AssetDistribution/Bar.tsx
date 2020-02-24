// @flow

import React from "react";
import styled from "styled-components";

interface Props {
  height?: number;
  progress: string;
  progressColor: string;
  backgroundColor?: string;
}

export default function Bar({ height = 6, backgroundColor, progressColor, progress }: Props) {
  return (
    <Wrapper height={height} backgroundColor={backgroundColor}>
      <Progress height={height} width={Number(progress)} backgroundColor={progressColor} />
    </Wrapper>
  );
}

interface WrapperProps {
  height: number;
  backgroundColor?: string;
}

const Wrapper = styled.div<WrapperProps>`
  height: ${p => p.height}px;
  flex-grow: 1;
  background-color: ${p => p.backgroundColor || p.theme.colors.palette.divider};
  border-radius: ${p => p.height}px;
  overflow: hidden;
`;

interface ProgressProps {
  height?: number;
  width: number;
  backgroundColor: string | undefined;
}

const Progress = styled.div<ProgressProps>`
  height: ${p => p.height}px;
  background-color: ${p => p.backgroundColor};
  border-radius: ${p => p.height}px;
  transition: transform 800ms ease-out;
  width: 100%;
  ${({ width }) => `
    transform: translateX(-${100 - Number(width)}%)}
  `}
`;
