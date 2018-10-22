// @flow

import React, { PureComponent } from 'react'
import { Buffer } from 'buffer'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'

import { accountsSelector } from 'reducers/accounts'
import { exportSettingsSelector } from 'reducers/settings'
import { encode } from '@ledgerhq/live-common/lib/cross'
import { dataToFrames } from 'qrloop/exporter'
import QRCode from './base/QRCode'

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  settings: exportSettingsSelector,
})

class QRCodeExporter extends PureComponent<
  {
    accounts: *,
    settings: *,
    size: number,
  },
  {
    frame: number,
    fps: number,
  },
> {
  static defaultProps = {
    size: 460,
  }

  constructor(props) {
    super()
    const { accounts, settings } = props
    const data = encode({
      accounts,
      settings,
      exporterName: 'desktop',
      exporterVersion: __APP_VERSION__,
    })

    this.chunks = dataToFrames(data, 160, 4)

    setTimeout(() => {
      const BRIDGESTREAM_DATA = Buffer.from(JSON.stringify(dataToFrames(data, 160, 1))).toString(
        'base64',
      )
      console.log(`BRIDGESTREAM_DATA=${BRIDGESTREAM_DATA}`) // eslint-disable-line
    }, 500)
  }

  state = {
    frame: 0,
    fps: 3,
  }

  componentDidMount() {
    const nextFrame = ({ frame }) => {
      frame = (frame + 1) % this.chunks.length
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

  chunks: string[]
  _raf: *

  render() {
    const { frame } = this.state
    const { size } = this.props
    const { chunks } = this
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
