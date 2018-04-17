// @flow

import React, { PureComponent } from 'react'
import { remote } from 'electron'
import qs from 'qs'

import CurrentAddress from 'components/CurrentAddress'

class Print extends PureComponent<any> {
  componentDidMount() {
    window.requestAnimationFrame(() =>
      setTimeout(() => {
        if (!this._node) {
          return
        }

        const { height, width } = this._node.getBoundingClientRect()
        const currentWindow = remote.getCurrentWindow()

        currentWindow.setContentSize(width, height)
        currentWindow.emit('print-ready')
      }, 300),
    )
  }

  _node = null

  render() {
    const data = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })

    if (!data) {
      return null
    }
    const { address, amount, accountName } = data
    return (
      <CurrentAddress
        accountName={accountName}
        address={address}
        amount={amount}
        innerRef={n => (this._node = n)}
        withQRCode
      />
    )
  }
}

export default Print
