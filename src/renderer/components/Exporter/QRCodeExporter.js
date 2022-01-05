// @flow

import React, { PureComponent } from "react";
import { Buffer } from "buffer";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import styled from "styled-components";
import { dataToFrames } from "qrloop";

import { encode } from "@ledgerhq/live-common/lib/cross";

import { activeAccountsSelector } from "~/renderer/reducers/accounts";
import { exportSettingsSelector } from "~/renderer/reducers/settings";
import QRCode from "~/renderer/components/QRCode";

const mapStateToProps = createStructuredSelector({
  accounts: (state, props) => props.accounts || activeAccountsSelector(state),
  settings: exportSettingsSelector,
});

const QRCodeContainer = styled.div`
  position: relative;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);
  border: solid 1px ${props => props.theme.colors.palette.divider};
  background-color: ${p => p.theme.colors.white};
`;

type OwnProps = {
  size: number,
};

type Props = OwnProps & {
  accounts: *,
  settings: *,
};

class QRCodeExporter extends PureComponent<
  Props,
  {
    frame: number,
    framesRendered: number,
    fps: number,
  },
> {
  static defaultProps = {
    size: 460,
  };

  constructor(props) {
    super();
    const { accounts, settings } = props;
    const data = encode({
      accounts,
      settings,
      exporterName: "desktop",
      exporterVersion: __APP_VERSION__,
    });

    this.chunks = dataToFrames(data, 160, 4);

    setTimeout(() => {
      const BRIDGESTREAM_DATA = Buffer.from(JSON.stringify(this.chunks)).toString("base64");
      console.log(`BRIDGESTREAM_DATA=${BRIDGESTREAM_DATA}`); // eslint-disable-line
    }, 500);
  }

  state = {
    frame: 0,
    framesRendered: 1,
    fps: 3,
  };

  componentDidMount() {
    const nextFrame = ({ frame, framesRendered }) => {
      frame = (frame + 1) % this.chunks.length;
      framesRendered = Math.min(Math.max(framesRendered, frame + 1), this.chunks.length);
      return { frame, framesRendered };
    };

    let lastT;
    const loop = t => {
      this._raf = requestAnimationFrame(loop);
      if (!lastT) lastT = t;
      if ((t - lastT) * this.state.fps < 1000) return;
      lastT = t;
      this.setState(nextFrame);
    };
    this._raf = requestAnimationFrame(loop);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._raf);
  }

  chunks: string[];
  _raf: *;

  render() {
    const { frame, framesRendered } = this.state;
    const { size } = this.props;
    const { chunks } = this;
    const chunkValues = process.env.PLAYWRIGHT_RUN ? [0, 1] : [0, framesRendered];
    return (
      <QRCodeContainer style={{ width: size, height: size }}>
        {chunks.slice(...chunkValues).map((chunk, i) => (
          <div key={String(i)} style={{ position: "absolute", opacity: i === frame ? 1 : 0 }}>
            <QRCode data={chunk} size={Math.max(size - 24, 0)} errorCorrectionLevel="M" />
          </div>
        ))}
      </QRCodeContainer>
    );
  }
}

const ConnectedQRCodeExporter: React$ComponentType<OwnProps> = connect(mapStateToProps)(
  QRCodeExporter,
);
export default ConnectedQRCodeExporter;
