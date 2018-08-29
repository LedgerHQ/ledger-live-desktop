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
    fps: 4,
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
