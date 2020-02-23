// @flow

import React from "react";
import styled from "styled-components";

interface Props {
  height: number;
  progress: string;
  progressColor: string;
  backgroundColor?: string;
}

export default function Bar({ height = 6, backgroundColor, progressColor, progress }) {
  return (
    <Wrapper height={height} backgroundColor={backgroundColor}>
      <Progress height={height} width={progress} backgroundColor={progressColor} />
    </Wrapper>
  );
}

interface WrapperProps {
  height: number;
  backgroundColor?: string;
}

const Wrapper =
  styled.div <
  WrapperProps >
  `
  height: ${p => p.height}px;
  flex-grow: 1;
  background-color: ${p => p.backgroundColor || p.theme.colors.palette.divider};
  border-radius: ${p => p.height}px;
  overflow: hidden;
`;

interface ProgressProps {
  height: number;
  width: string;
  backgroundColor: string | undefined;
}

const Progress = styled.div.attrs<ProgressProps>(p => ({
  style: {
    transform: `translateX(-${100 - p.width}%)`,
  },
}))`
  height: ${p => p.height}px;
  background-color: ${p => p.backgroundColor};
  border-radius: ${p => p.height}px;
  transition: transform 800ms ease-out;
  width: 100%;
`;
