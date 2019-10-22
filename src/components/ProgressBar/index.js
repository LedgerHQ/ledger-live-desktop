// @flow

import React, { PureComponent } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { colors } from 'styles/theme'

const animIndeterminate = keyframes`
  0% {
    transform: scaleX(0) translate3d(0, 0, 0);
  }
  50% {
    transform: scaleX(1) translate3d(100%, 0, 0);
  }
  100% {
    transform: scaleX(0) translate3d(0, 0, 0);
  }
`

const Outer = styled.div`
  background-color: ${p => p.theme.colors.palette.divider};
  border-radius: 3px;
  overflow: hidden;
  height: 5px;
  width: ${p => p.width}px;
  position: relative;
`

const Inner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.wallet};
  transform-origin: center left;

  ${p =>
    p.progress === 0
      ? css`
          animation: ${animIndeterminate} 2s cubic-bezier(0.61, 0.01, 0.39, 1.03) infinite;
        `
      : css`
          transform: scaleX(${p => p.progress});
        `};
`

type Props = {
  progress: number,
  width: number,
}

class ProgressBar extends PureComponent<Props> {
  render() {
    const { progress, width } = this.props
    return (
      <Outer width={width}>
        <Inner progress={progress} />
      </Outer>
    )
  }
}

export default ProgressBar
