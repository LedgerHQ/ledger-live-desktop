// @flow

import React, { PureComponent } from 'react'
import { i } from 'helpers/staticPath'
import Confetti from './Confetti'

const shapes = [
  i('confetti-shapes/1.svg'),
  i('confetti-shapes/2.svg'),
  i('confetti-shapes/3.svg'),
  i('confetti-shapes/4.svg'),
]

let id = 1

const nextConfetti = (mode: ?string) =>
  mode === 'emit'
    ? {
        id: id++,
        shape: shapes[Math.floor(shapes.length * Math.random())],
        initialRotation: 360 * Math.random(),
        initialYPercent: -0.05,
        initialXPercent:
          0.5 + 0.5 * Math.cos(Date.now() / 1000) * (0.5 + 0.5 * Math.sin(Date.now() / 6000)),
        initialScale: 1,
        rotations: 4 * Math.random() - 2,
        delta: [(Math.random() - 0.5) * 200, 600 + 200 * Math.random()],
        duration: 10000,
      }
    : {
        id: id++,
        shape: shapes[Math.floor(shapes.length * Math.random())],
        initialRotation: 360 * Math.random(),
        initialYPercent: -0.04 + -0.25 * Math.random(),
        initialXPercent: 0.2 + 0.6 * Math.random(),
        initialScale: 1,
        rotations: 8 * Math.random() - 4,
        delta: [(Math.random() - 0.5) * 1500, 500 + 500 * Math.random()],
        duration: 12000 + 8000 * Math.random(),
      }

class ConfettiParty extends PureComponent<{ emit: boolean }, { confettis: Array<Object> }> {
  state = {
    // $FlowFixMe
    confettis: Array(100)
      .fill(null)
      .map(nextConfetti),
  }

  componentDidMount() {
    this.setEmit(this.props.emit)
    this.initialTimeout = setTimeout(() => {
      clearInterval(this.initialInterval)
    }, 10000)
    this.initialInterval = setInterval(() => {
      this.setState(({ confettis }) => ({
        confettis: confettis.slice(confettis.length > 200 ? 1 : 0).concat(nextConfetti()),
      }))
    }, 100)
  }

  componentDidUpdate(prevProps: *) {
    if (this.props.emit !== prevProps.emit) {
      this.setEmit(this.props.emit)
    }
  }

  componentWillUnmount() {
    this.setEmit(false)
    clearInterval(this.initialInterval)
    clearTimeout(this.initialTimeout)
  }

  setEmit(on: boolean) {
    if (on) {
      this.interval = setInterval(() => {
        this.setState(({ confettis }) => ({
          confettis: confettis.slice(confettis.length > 200 ? 1 : 0).concat(nextConfetti('emit')),
        }))
      }, 40)
    } else {
      clearInterval(this.interval)
    }
  }
  interval: *
  initialInterval: *
  initialTimeout: *

  render() {
    const { confettis } = this.state
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {confettis.map(c => (
          <Confetti key={c.id} {...c} />
        ))}
      </div>
    )
  }
}

export default ConfettiParty
