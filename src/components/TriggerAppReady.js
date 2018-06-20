// @flow

import { PureComponent } from 'react'

export default class TriggerAppReady extends PureComponent<{}> {
  componentDidMount() {
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
