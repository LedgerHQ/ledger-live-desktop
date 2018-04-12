// @flow

import { PureComponent } from 'react'
import qs from 'qs'

let BrowserWindow = null

if (!process.env.STORYBOOK_ENV) {
  const { remote } = require('electron')
  BrowserWindow = remote.BrowserWindow // eslint-disable-line
}

type Props = {
  render: Function,
  data: Object,
}

type State = {
  isLoading: boolean,
}

class Print extends PureComponent<Props, State> {
  state = {
    isLoading: false,
  }

  handlePrint = () => {
    if (BrowserWindow === null) {
      return
    }

    const { data } = this.props

    this.setState({ isLoading: true })

    const w = new BrowserWindow({
      show: false,
      webPreferences: {
        // Enable, among other things, the ResizeObserver
        experimentalFeatures: true,
      },
    })

    const url = __DEV__
      ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT || ''}`
      : `file://${__dirname}/index.html`

    w.loadURL(`${url}/#/print?${qs.stringify(data)}`)

    w.webContents.on('did-finish-load', () =>
      w.on('print-ready', () => {
        w.webContents.print({}, () => w.destroy())
        this.setState({ isLoading: false })
      }),
    )
  }

  render() {
    const { render } = this.props
    const { isLoading } = this.state
    return render(this.handlePrint, isLoading)
  }
}

export default Print
