// @flow

import React, { PureComponent } from 'react'
import qrcode from 'qrcode'

type Props = {
  data: string,
  size: number,
}

class QRCode extends PureComponent<Props> {
  static defaultProps = {
    size: 200,
  }

  componentDidMount() {
    this.drawQRCode()
  }

  componentDidUpdate() {
    this.drawQRCode()
  }

  _canvas = null

  drawQRCode() {
    const { data, size } = this.props
    qrcode.toCanvas(this._canvas, data, {
      width: size,
      margin: 0,
      errorCorrectionLevel: 'Q',
      color: {
        light: '#ffffff00', // transparent background
      },
    })
  }

  render() {
    return <canvas ref={n => (this._canvas = n)} />
  }
}

export default QRCode
