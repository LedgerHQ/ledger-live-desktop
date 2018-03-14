// @flow

import React, { PureComponent } from 'react'

import { connect } from 'react-redux'
import type { State } from 'reducers'
import { getVisibleAccounts } from 'reducers/accounts'
import QRCode from './base/QRCode'

// encode the app state to export into an array of chunks for the mobile app to understand.
// returned data frames are json stringified array with format: [ datalength, index, type, ...rest ]
// NB as soon as we have common types we'll move this in a ledgerhq/common project
function makeChunks(state: State): Array<string> {
  const chunksFormatVersion = 1
  const desktopVersion = __APP_VERSION__
  const data = [
    ['meta', chunksFormatVersion, 'desktop', desktopVersion],
    ...getVisibleAccounts(state).map(account => [
      'account',
      account.id,
      account.name,
      account.coinType,
    ]),
  ]
  return data.map((arr, i) => JSON.stringify([data.length, i, ...arr]))
}

const mapStateToProps = (state: State) => ({ chunks: makeChunks(state) })

class QRCodeExporter extends PureComponent<
  {
    chunks: string[],
    fps: number,
    size: number,
  },
  {
    frame: number,
  },
> {
  static defaultProps = {
    fps: 10,
    size: 480,
  }

  state = {
    frame: 0,
  }

  componentDidMount() {
    const nextFrame = ({ frame }, { chunks }) => ({
      frame: (frame + 1) % chunks.length,
    })
    let lastT
    const loop = t => {
      this._raf = requestAnimationFrame(loop)
      if (!lastT) lastT = t
      if ((t - lastT) * this.props.fps < 1000) return
      lastT = t
      this.setState(nextFrame)
    }
    this._raf = requestAnimationFrame(loop)
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._raf)
  }

  _raf: *

  render() {
    const { frame } = this.state
    const { chunks, size } = this.props
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        {chunks.map((chunk, i) => (
          <div key={String(i)} style={{ position: 'absolute', opacity: i === frame ? 1 : 0 }}>
            <QRCode data={chunk} size={size} />
          </div>
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps)(QRCodeExporter)
