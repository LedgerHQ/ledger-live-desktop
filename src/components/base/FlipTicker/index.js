// @flow

/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react/no-array-index-key */

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'

import Box from 'components/base/Box'

const Container = styled(Box).attrs({
  horizontal: true,
  relative: true,
})`
  overflow: hidden;
  white-space: pre;
`

const TickWrapper = styled(Box).attrs({
  style: p => ({
    transform: `translate3d(0, -${p.offset}px, 0)`,
  }),
})`
  top: 0;
  position: absolute;
`

const RANGE_NUMBER = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const RANGE_COMPONENT = RANGE_NUMBER.map((r, i) => <Box key={i}>{r}</Box>)

const SPRINT_CONFIG = {
  stiffness: 280,
  damping: 23,
}

type Props = {
  value: string,
}

type State = {
  height: ?number,
}

class FlipTicker extends PureComponent<Props, State> {
  state = {
    height: null,
  }

  componentDidMount() {
    if (this._node instanceof HTMLDivElement) {
      const { height } = this._node.getBoundingClientRect()
      this.setState({
        height,
      })
    }
  }

  _node = null

  render() {
    const { value, ...p } = this.props
    const { height } = this.state
    return (
      <Container innerRef={n => (this._node = n)} {...p}>
        {value.split('').map((l, i) => (
          <Box key={i}>
            {!/[0-9]/.test(l) ? (
              l === ' ' ? (
                <span>&nbsp;</span>
              ) : (
                l
              )
            ) : (
              <Fragment>
                <span
                  style={{
                    visibility: 'hidden',
                  }}
                >
                  {l}
                </span>
                {height && <Tick height={height} value={l} />}
              </Fragment>
            )}
          </Box>
        ))}
      </Container>
    )
  }
}

function Tick(props: { height: number, value: string }) {
  const { height, value } = props

  const index = RANGE_NUMBER.indexOf(value)
  const offset = height * index

  return (
    <Motion
      style={{
        offset: spring(offset, SPRINT_CONFIG),
      }}
    >
      {m => <TickWrapper offset={m.offset}>{RANGE_COMPONENT}</TickWrapper>}
    </Motion>
  )
}

export default FlipTicker
