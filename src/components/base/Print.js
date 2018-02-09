// @flow

import { PureComponent } from 'react'
import { remote } from 'electron'
import queryString from 'query-string'

const { BrowserWindow } = remote

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
    const { data } = this.props

    this.setState({ isLoading: true })

    const w = new BrowserWindow({
      show: false,
      webPreferences: {
        // Enable, among other things, the ResizeObserver
        experimentalFeatures: true,
      },
    })

    w.webContents.openDevTools()

    const url = __DEV__
      ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT || ''}`
      : `file://${__dirname}/index.html`

    w.loadURL(`${url}/#/print?${queryString.stringify(data)}`)

    w.webContents.on('did-finish-load', () => {
      w.on('minimize', () => {
        w.webContents.print({}, () => {
          w.destroy()
          this.setState({ isLoading: false })
        })
      })
    })
  }

  render() {
    const { render } = this.props
    const { isLoading } = this.state
    return render(this.handlePrint, isLoading)
  }
}

export default Print
