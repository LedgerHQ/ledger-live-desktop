// @flow

import React, { PureComponent } from 'react'
import { colors } from 'styles/theme'
import styled from 'styled-components'

type Props = {
  height: number,
  progress: string,
  progressColor: string,
  backgroundColor: string,
}

const Wrapper = styled.div`
  height: ${p => p.height}px;
  flex-grow: 1;
  background-color: ${p => p.backgroundColor};
  border-radius: ${p => p.height}px;
`

const Progress = styled.div`
  width: ${p => p.width}%;
  height: ${p => p.height}px;
  background-color: ${p => p.backgroundColor};
  border-radius: ${p => p.height}px;
`

class Bar extends PureComponent<Props> {
  static defaultProps = {
    height: 6,
    backgroundColor: colors.lightFog,
  }

  render() {
    const { height, backgroundColor, progressColor, progress } = this.props
    return (
      <Wrapper height={height} backgroundColor={backgroundColor}>
        <Progress height={height} width={progress} backgroundColor={progressColor} />
      </Wrapper>
    )
  }
}

export default Bar
