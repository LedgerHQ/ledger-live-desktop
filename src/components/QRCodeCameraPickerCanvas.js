// @flow

import React, { Component } from 'react'
import QrCode from 'qrcode-reader'
import logger from 'logger'

export default class QRCodeCameraPickerCanvas extends Component<
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
    message: ?string,
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
  }

  state = {
    message: 'Please accept Camera permission',
  }

  componentDidMount() {
    let getUserMedia
    let sum = 0
    const onkeyup = (e: *) => {
      sum += e.which
      if (sum === 439 && this.canvasSecond) {
        this.canvasSecond.style.filter = 'hue-rotate(90deg)'
      }
    }
    if (document) document.addEventListener('keyup', onkeyup)
    this.unsubscribes.push(() => {
      if (document) document.removeEventListener('keyup', onkeyup)
    })
    const { navigator } = window
    if (navigator.mediaDevices) {
      const mediaDevices = navigator.mediaDevices
      getUserMedia = opts => mediaDevices.getUserMedia(opts)
    } else {
      const f = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
      if (f) {
        getUserMedia = opts => new Promise((res, rej) => f.call(navigator, opts, res, rej))
      }
    }

    if (!getUserMedia) {
      this.setState({ message: 'Incompatible browser' }) // eslint-disable-line
    } else {
      const qr = new QrCode()
      qr.callback = (err, value) => {
        if (!err) {
          this.props.onPick(value.result)
        }
      }
      getUserMedia({
        video: { facingMode: 'environment' },
      })
        .then(stream => {
          if (this.unmounted) return
          this.setState({ message: null })
          let video = document.createElement('video')
          video.setAttribute('playsinline', 'true')
          video.setAttribute('autoplay', 'true')
          video.srcObject = stream
          video.load()
          this.unsubscribes.push(() => {
            if (video) {
              video.pause()
              video.srcObject = null
              video = null
            }
          })
          video.onloadedmetadata = () => {
            if (this.unmounted || !video) return
            try {
              video.play()
            } catch (e) {
              logger.error(e)
            }
            let lastCheck = 0
            let raf
            const loop = (t: number) => {
              raf = requestAnimationFrame(loop)
              const { ctxMain, ctxSecond } = this
              if (!ctxMain || !ctxSecond || !video) return
              const {
                centerSize,
                cameraBorderSize,
                cameraBorderLength,
                dpr,
                intervalCheck,
              } = this.props
              const cs = centerSize * dpr
              const cbs = cameraBorderSize * dpr
              const cbl = cameraBorderLength * dpr
              const { width, height } = ctxMain.canvas
              ctxMain.drawImage(video, 0, 0, width, height)

              // draw second in the inner
              const x = Math.floor((width - cs) / 2 - cbs)
              const y = Math.floor((height - cs) / 2 - cbs)
              const w = cs + cbs * 2
              const h = cs + cbs * 2
              ctxSecond.beginPath()
              ctxSecond.rect(x, y, w, h)
              ctxSecond.clip()
              ctxSecond.drawImage(ctxMain.canvas, 0, 0)

              // draw the camera borders
              ctxSecond.strokeStyle = '#fff'
              ctxSecond.lineWidth = cbs
              ctxSecond.beginPath()
              ctxSecond.moveTo(x + cbl, y)
              ctxSecond.lineTo(x, y)
              ctxSecond.lineTo(x, y + cbl)
              ctxSecond.stroke()
              ctxSecond.beginPath()
              ctxSecond.moveTo(x + cbl, y + h)
              ctxSecond.lineTo(x, y + h)
              ctxSecond.lineTo(x, y + h - cbl)
              ctxSecond.stroke()
              ctxSecond.beginPath()
              ctxSecond.moveTo(x + w - cbl, y + h)
              ctxSecond.lineTo(x + w, y + h)
              ctxSecond.lineTo(x + w, y + h - cbl)
              ctxSecond.stroke()
              ctxSecond.beginPath()
              ctxSecond.moveTo(x + w - cbl, y)
              ctxSecond.lineTo(x + w, y)
              ctxSecond.lineTo(x + w, y + cbl)
              ctxSecond.stroke()

              if (t - lastCheck >= intervalCheck) {
                lastCheck = t
                qr.decode(ctxMain.getImageData(0, 0, width, height))
              }
            }
            raf = requestAnimationFrame(loop)
            this.unsubscribes.push(() => cancelAnimationFrame(raf))
          }
        })
        .catch(e => {
          if (this.unmounted) return
          this.setState({
            message: String(e.message || e.name || e),
          })
        })
    }
  }
  componentWillUnmount() {
    this.unmounted = true
    this.unsubscribes.forEach(f => f())
  }

  canvasMain: ?HTMLCanvasElement
  ctxMain: ?CanvasRenderingContext2D
  canvasSecond: ?HTMLCanvasElement
  ctxSecond: ?CanvasRenderingContext2D
  unsubscribes: Array<() => void> = []
  unmounted = false

  _onMainRef = (canvasMain: ?HTMLCanvasElement) => {
    if (canvasMain === this.canvasMain) return
    this.canvasMain = canvasMain
    if (canvasMain) {
      this.ctxMain = canvasMain.getContext('2d')
    }
  }

  _onSecondRef = (canvasSecond: ?HTMLCanvasElement) => {
    if (canvasSecond === this.canvasSecond) return
    this.canvasSecond = canvasSecond
    if (canvasSecond) {
      this.ctxSecond = canvasSecond.getContext('2d')
    }
  }

  render() {
    const { width, height, dpr } = this.props
    const { message } = this.state
    const style = {
      width,
      height,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#eee',
      color: '#666',
      fontSize: `${(width / 30).toFixed(0)}px`,
      overflow: 'hidden',
    }
    const mainStyle = {
      width,
      height,
      position: 'absolute',
      top: 0,
      left: 0,
      filter: 'brightness(80%) blur(6px)',
      transform: 'scaleX(-1)',
    }
    const secondStyle = {
      width,
      height,
      position: 'absolute',
      top: 0,
      left: 0,
      transform: 'scaleX(-1)',
    }
    return message ? (
      <div style={style}>
        <p>{message}</p>
      </div>
    ) : (
      <div style={style}>
        <canvas ref={this._onMainRef} style={mainStyle} width={dpr * width} height={dpr * height} />
        <canvas
          ref={this._onSecondRef}
          style={secondStyle}
          width={dpr * width}
          height={dpr * height}
        />
      </div>
    )
  }
}
