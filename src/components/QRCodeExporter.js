// @flow

import React, { PureComponent } from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'

import { accountsSelector } from 'reducers/accounts'
import { makeChunks } from '@ledgerhq/live-common/lib/bridgestream/exporter'
import QRCode from './base/QRCode'

const mapStateToProps = createSelector(accountsSelector, accounts => ({
  chunks: makeChunks({
    accounts,
    exporterName: 'desktop',
    exporterVersion: __APP_VERSION__,
    pad: true,
  }),
}))

const LOW_FPS = 2
const HIGH_FPS = 8

class QRCodeExporter extends PureComponent<
  {
    chunks: string[],
    size: number,
  },
  {
    frame: number,
    fps: number,
  },
> {
  static defaultProps = {
    size: 440,
  }

  state = {
    frame: 0,
    fps: HIGH_FPS,
  }

  componentDidMount() {
    console.log(`BRIDGESTREAM_DATA=${btoa(JSON.stringify(this.props.chunks))}`) // eslint-disable-line

    const nextFrame = ({ frame, fps }, { chunks }) => {
      frame = (frame + 1) % chunks.length
      return {
        frame,
        fps: frame === 0 ? (fps === LOW_FPS ? HIGH_FPS : LOW_FPS) : fps,
      }
    }

    let lastT
    const loop = t => {
      this._raf = requestAnimationFrame(loop)
      if (!lastT) lastT = t
      if ((t - lastT) * this.state.fps < 1000) return
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
            <QRCode data={chunk} size={size} errorCorrectionLevel="M" />
          </div>
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps)(QRCodeExporter)
