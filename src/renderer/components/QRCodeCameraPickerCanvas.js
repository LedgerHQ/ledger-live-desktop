// @flow

import React, { PureComponent } from "react";
import jsQR from "jsqr";
import styled from "styled-components";
import { NoAccessToCamera } from "@ledgerhq/errors";

import logger from "~/logger";
import IconCameraError from "~/renderer/icons/CameraError";
import IconCross from "~/renderer/icons/Cross";
import TranslatedError from "./TranslatedError";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const CameraWrapper: ThemedComponent<{ width: number, height: number }> = styled.div`
  width: ${p => p.width}px;
  height: ${p => p.height}px;
  padding: 12px 0px;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: #f9f9f9;
  color: ${p => p.theme.colors.palette.text.shade60};
  overflow: hidden;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    p {
      font-family: "Inter";
      font-weight: 600;
      padding: 12px 24px;
      font-size: 13px;
      color: ${p => p.theme.colors.palette.text.shade80};
    }
  }
`;

const Camera = styled.canvas`
  width: ${p => p.width / p.dpr}px;
  height: ${p => p.height / p.dpr}px;
  position: absolute;
  top: 0;
  left: 0;
  filter: brightness(80%) blur(6px);
  transform: scaleX(-1);
`;

const Overlay = styled.canvas`
  width: ${p => p.width / p.dpr}px;
  height: ${p => p.height / p.dpr}px;
  position: absolute;
  top: 0;
  left: 0;
  transform: scaleX(-1);
`;
// NB symbolic button since everything dismisses this
const Close = styled.div`
  align-self: flex-end;
  margin-right: 12px;
  margin-top: 12px;
  color: ${p => p.theme.colors.palette.divider};
`;
export default class QRCodeCameraPickerCanvas extends PureComponent<
  {
    width: number,
    height: number,
    centerSize: number,
    cameraBorderSize: number,
    cameraBorderLength: number,
    intervalCheck: number,
    dpr: number,
    onPick: string => void,
  },
  {
    error: ?Error,
  },
> {
  static defaultProps = {
    width: 260,
    height: 185,
    centerSize: 110,
    cameraBorderSize: 4,
    cameraBorderLength: 35,
    intervalCheck: 250,
    dpr: window.devicePixelRatio || 1,
  };

  state = {};

  componentDidMount() {
    let getUserMedia;
    let sum = 0;
    const onkeyup = (e: *) => {
      sum += e.which;
      if (sum === 439 && this.canvasSecond) {
        this.canvasSecond.style.filter = "hue-rotate(90deg)";
      }
    };
    if (document) document.addEventListener("keyup", onkeyup);
    this.unsubscribes.push(() => {
      if (document) document.removeEventListener("keyup", onkeyup);
    });
    const { navigator } = window;
    if (navigator.mediaDevices) {
      const mediaDevices = navigator.mediaDevices;
      getUserMedia = opts => mediaDevices.getUserMedia(opts);
    } else {
      const f = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (f) {
        getUserMedia = opts => new Promise((res, rej) => f.call(navigator, opts, res, rej));
      }
    }

    if (!getUserMedia) {
      this.setState({ error: new NoAccessToCamera() }); // eslint-disable-line
    } else {
      getUserMedia({
        video: { facingMode: "environment" },
      })
        .then(stream => {
          if (this.unmounted) return;
          this.setState({ error: null });
          let video = document.createElement("video");
          video.setAttribute("playsinline", "true");
          video.setAttribute("autoplay", "true");
          video.srcObject = stream;
          video.load();
          this.unsubscribes.push(() => {
            if (video) {
              video.pause();
              video.srcObject = null;
              video = null;
            }
          });
          video.onloadedmetadata = () => {
            if (this.unmounted || !video) return;
            try {
              video.play();
            } catch (e) {
              logger.error(e);
            }
            let lastCheck = 0;
            let raf;
            const loop = (t: number) => {
              raf = requestAnimationFrame(loop);
              const { ctxMain, ctxSecond } = this;
              if (!ctxMain || !ctxSecond || !video) return;
              const {
                centerSize,
                cameraBorderSize,
                cameraBorderLength,
                dpr,
                intervalCheck,
              } = this.props;
              const cs = centerSize * dpr;
              const cbs = cameraBorderSize * dpr;
              const cbl = cameraBorderLength * dpr;
              const { width, height } = ctxMain.canvas;
              ctxMain.drawImage(video, 0, 0, width, height);

              // draw second in the inner
              const x = Math.floor((width - cs) / 2 - cbs);
              const y = Math.floor((height - cs) / 2 - cbs);
              const w = cs + cbs * 2;
              const h = cs + cbs * 2;
              ctxSecond.beginPath();
              ctxSecond.rect(x, y, w, h);
              ctxSecond.clip();
              ctxSecond.drawImage(ctxMain.canvas, 0, 0);

              // draw the camera borders
              ctxSecond.strokeStyle = "#fff";
              ctxSecond.lineWidth = cbs;
              ctxSecond.beginPath();
              ctxSecond.moveTo(x + cbl, y);
              ctxSecond.lineTo(x, y);
              ctxSecond.lineTo(x, y + cbl);
              ctxSecond.stroke();
              ctxSecond.beginPath();
              ctxSecond.moveTo(x + cbl, y + h);
              ctxSecond.lineTo(x, y + h);
              ctxSecond.lineTo(x, y + h - cbl);
              ctxSecond.stroke();
              ctxSecond.beginPath();
              ctxSecond.moveTo(x + w - cbl, y + h);
              ctxSecond.lineTo(x + w, y + h);
              ctxSecond.lineTo(x + w, y + h - cbl);
              ctxSecond.stroke();
              ctxSecond.beginPath();
              ctxSecond.moveTo(x + w - cbl, y);
              ctxSecond.lineTo(x + w, y);
              ctxSecond.lineTo(x + w, y + cbl);
              ctxSecond.stroke();

              if (t - lastCheck >= intervalCheck) {
                lastCheck = t;
                const imageData = ctxMain.getImageData(0, 0, width, height);
                const code = jsQR(imageData.data, width, height);

                if (code && code.data) {
                  this.props.onPick(code.data);
                }
              }
            };
            raf = requestAnimationFrame(loop);
            this.unsubscribes.push(() => cancelAnimationFrame(raf));
          };
        })
        .catch(e => {
          if (this.unmounted) return;
          this.setState({ error: new NoAccessToCamera(e.message) });
        });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.unsubscribes.forEach(f => f());
  }

  canvasMain: ?HTMLCanvasElement;
  ctxMain: ?CanvasRenderingContext2D;
  canvasSecond: ?HTMLCanvasElement;
  ctxSecond: ?CanvasRenderingContext2D;
  unsubscribes: Array<() => void> = [];
  unmounted = false;

  _onMainRef = (canvasMain: ?HTMLCanvasElement) => {
    if (canvasMain === this.canvasMain) return;
    this.canvasMain = canvasMain;
    if (canvasMain) {
      this.ctxMain = canvasMain.getContext("2d");
    }
  };

  _onSecondRef = (canvasSecond: ?HTMLCanvasElement) => {
    if (canvasSecond === this.canvasSecond) return;
    this.canvasSecond = canvasSecond;
    if (canvasSecond) {
      this.ctxSecond = canvasSecond.getContext("2d");
    }
  };

  render() {
    const { width, height, dpr } = this.props;
    const { error } = this.state;
    return error ? (
      <CameraWrapper width={width} height={height}>
        <Close>
          <IconCross size={14} />
        </Close>
        <div>
          <IconCameraError size={32} />
          <p>
            <TranslatedError error={error} />
          </p>
        </div>
      </CameraWrapper>
    ) : (
      <CameraWrapper width={width} height={height}>
        <Camera ref={this._onMainRef} dpr={dpr} width={dpr * width} height={dpr * height} />
        <Overlay ref={this._onSecondRef} dpr={dpr} width={dpr * width} height={dpr * height} />
      </CameraWrapper>
    );
  }
}
