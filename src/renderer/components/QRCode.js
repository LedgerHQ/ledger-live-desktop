// @flow

import React, { PureComponent } from "react";
import qrcode from "qrcode";

type Props = {
  data: string,
  errorCorrectionLevel: string,
  size: number,
};

class QRCode extends PureComponent<Props> {
  static defaultProps = {
    size: 200,
    errorCorrectionLevel: "Q",
  };

  componentDidMount() {
    this.drawQRCode();
  }

  componentDidUpdate() {
    this.drawQRCode();
  }

  canvas: * = React.createRef();

  drawQRCode() {
    const { data, size, errorCorrectionLevel } = this.props;
    const { current } = this.canvas;
    if (!current) return;
    qrcode.toCanvas(
      current,
      data,
      {
        width: current.width,
        margin: 0,
        errorCorrectionLevel,
      },
      () => {
        // fix again the CSS because lib changes it –_–
        current.style.width = `${size}px`;
        current.style.height = `${size}px`;
      },
    );
  }

  render() {
    const { size } = this.props;
    const px = size * (window.devicePixelRatio || 1);
    return (
      <canvas
        style={{ cursor: "none", width: `${size}px`, height: `${size}px` }}
        width={px}
        height={px}
        ref={this.canvas}
      />
    );
  }
}

export default QRCode;
