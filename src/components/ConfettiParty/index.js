import React, { PureComponent } from 'react'
import { i } from 'helpers/staticPath'
import Confetti from './Confetti'

const shapes = [
  i('confetti-shapes/1.svg'),
  i('confetti-shapes/2.svg'),
  i('confetti-shapes/3.svg'),
  i('confetti-shapes/4.svg'),
]

class ConfettiParty extends PureComponent<{}> {
  state = {
    confettis: Array(64)
      .fill(null)
      .map((_, i) => ({
        id: i,
        shape: shapes[Math.floor(shapes.length * Math.random())],
        initialRotation: 360 * Math.random(),
        initialYPercent: -0.2 + 0.1 * Math.random(),
        initialXPercent: 0.2 + 0.6 * Math.random(),
        initialScale: 1,
        rotations: 4 + 4 * Math.random(),
        delta: [(Math.random() - 0.5) * 600, 300 + 300 * Math.random()],
        duration: 6000 + 5000 * Math.random(),
      })),
  }

  render() {
    const { confettis } = this.state
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {confettis.map(c => <Confetti key={c.id} {...c} />)}
      </div>
    )
  }
}

export default ConfettiParty
