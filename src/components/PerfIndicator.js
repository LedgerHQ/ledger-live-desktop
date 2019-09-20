// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import ping from 'commands/ping'

const Indicator = styled.div`
  opacity: 0.8;
  border-radius: 3px;
  background-color: ${p => p.theme.colors.palette.background.paper};
  position: fixed;
  font-size: 10px;
  padding: 3px 6px;
  bottom: 0;
  left: 0;
  z-index: 999;
  pointer-events: none;
`

class PerfIndicator extends PureComponent<{}, { opsPerSecond: number }> {
  state = {
    opsPerSecond: 0,
  }
  componentDidMount() {
    let count = 0
    const loop = () => {
      ++count
      if (this.finished) return
      this.sub = ping.send().subscribe({
        complete: loop,
      })
    }
    loop()
    setInterval(() => {
      this.setState({ opsPerSecond: count })
      count = 0
    }, 1000)
  }
  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe()
      this.finished = true
    }
  }
  sub: *
  interval: *
  finished = false
  render() {
    return (
      <Indicator>
        {this.state.opsPerSecond}
        {' ops/s'}
      </Indicator>
    )
  }
}

export default PerfIndicator
