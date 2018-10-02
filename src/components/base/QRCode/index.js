// @flow

import React, { PureComponent } from 'react'
import qrcode from 'qrcode'

type Props = {
  data: string,
  errorCorrectionLevel: string,
  size: number,
}

class QRCode extends PureComponent<Props> {
  static defaultProps = {
    size: 200,
    errorCorrectionLevel: 'Q',
  }

  componentDidMount() {
    this.drawQRCode()
  }

  componentDidUpdate() {
    this.drawQRCode()
  }

  _canvas = null

  drawQRCode() {
    const { data, size, errorCorrectionLevel } = this.props
    qrcode.toCanvas(this._canvas, data, {
      width: size,
      margin: 0,
      errorCorrectionLevel,
      color: {
        light: '#ffffff00', // transparent background
      },
    })
  }

  render() {
    return <canvas style={{ cursor: 'none' }} ref={n => (this._canvas = n)} />
  }
}

export default QRCode
