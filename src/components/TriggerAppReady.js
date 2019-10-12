// @flow

import { PureComponent } from 'react'
import { ipcRenderer } from 'electron'

export default class TriggerAppReady extends PureComponent<{}> {
  componentDidMount() {
    ipcRenderer.send('ready-to-show', {})
    window.requestAnimationFrame(() => (this._timeout = setTimeout(() => window.onAppReady(), 300)))
  }
  componentWillUnmount() {
    clearTimeout(this._timeout)
  }
  _timeout: *
  render() {
    return null
  }
}
