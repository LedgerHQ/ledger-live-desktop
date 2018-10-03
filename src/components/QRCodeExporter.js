// @flow

import React, { PureComponent } from 'react'
import { Buffer } from 'buffer'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'

import { accountsSelector } from 'reducers/accounts'
import { exportSettingsSelector } from 'reducers/settings'
import { makeChunks } from '@ledgerhq/live-common/lib/bridgestream/exporter'
import QRCode from './base/QRCode'

const mapStateToProps = createSelector(
  accountsSelector,
  exportSettingsSelector,
  (accounts, settings) => ({
    chunks: makeChunks({
      accounts,
      settings,
      exporterName: 'desktop',
      exporterVersion: __APP_VERSION__,
      chunkSize: 120,
    }),
  }),
)

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
    fps: 5,
  }

  componentDidMount() {
    const BRIDGESTREAM_DATA = Buffer.from(JSON.stringify(this.props.chunks)).toString('base64')
    console.log(`BRIDGESTREAM_DATA=${BRIDGESTREAM_DATA}`) // eslint-disable-line

    const nextFrame = ({ frame }, { chunks }) => {
      frame = (frame + 1) % chunks.length
      return { frame }
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
