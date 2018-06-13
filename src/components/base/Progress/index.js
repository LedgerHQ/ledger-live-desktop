// @flow
import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'

import Box from 'components/base/Box'

const inifiteAnimation = keyframes`
  0% {
    left: 0
  }
  100% {
    left: 102%
  }
`

const fillInAnimation = keyframes`
  0% {
    transform: translate3d(-110%, 0, 0);
  }
  50% {
    transform: translate3d(-30%, 0, 0);
  }
  100% {
    transform: translate3d(0);
  }
`

const Bar = styled(Box).attrs({
  color: 'fog',
  borderRadius: '2.5px',
})`
  height: 5px;
  width: 100%;
  position: relative;
  background-color: currentColor;
  overflow: hidden;
`

const Progression = styled(Bar).attrs({
  color: 'wallet',
})`
  position: absolute;
  top: 0;
  left: 0;
  ${p =>
    p.infinite
      ? `
    animation: 1000ms ${inifiteAnimation} ease-out infinite;
    `
      : `
    animation: ${p.timing}ms ${fillInAnimation} ease-out;
    animation-fill-mode: forwards;
  `};
`

type Props = {
  infinite: boolean,
  timing?: number,
  color?: string,
}

type State = {}

class Progress extends Component<Props, State> {
  static defaultProps = {
    infinite: false,
    timing: 3000,
    color: 'wallet',
  }

  render() {
    const { infinite, color, timing } = this.props
    const styles = infinite ? { width: '20%' } : { width: '100%' }
    return (
      <Bar>
        <Progression infinite={infinite} color={color} style={styles} timing={timing} />
      </Bar>
    )
  }
}

export default Progress
