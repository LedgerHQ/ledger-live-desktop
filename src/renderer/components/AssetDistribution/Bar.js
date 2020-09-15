// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  height: number,
  progress: string,
  progressColor: string,
  backgroundColor?: string,
};

const Wrapper: ThemedComponent<{ height: number, backgroundColor?: string }> = styled.div`
  height: ${p => p.height}px;
  flex-grow: 1;
  background-color: ${p => p.backgroundColor || p.theme.colors.palette.divider};
  border-radius: ${p => p.height}px;
  overflow: hidden;
`;

const Progress: ThemedComponent<{
  height: number,
  width: string,
  backgroundColor?: string,
}> = styled.div.attrs(p => ({
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

class Bar extends PureComponent<Props> {
  static defaultProps = {
    height: 6,
  };

  render() {
    const { height, backgroundColor, progressColor, progress } = this.props;
    return (
      <Wrapper height={height} backgroundColor={backgroundColor}>
        <Progress height={height} width={progress} backgroundColor={progressColor} />
      </Wrapper>
    );
  }
}

export default Bar;
