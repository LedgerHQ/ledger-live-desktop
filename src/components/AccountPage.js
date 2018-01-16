// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'
import type { Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'

import { sendEvent } from 'renderer/events'

import Box from 'components/base/Box'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  currentDevice: getCurrentDevice(state),
  currentWallet: state.wallets.currentWallet,
})

type Props = {
  currentDevice: Device | null,
  currentWallet: Object | null,
}
type State = {
  address: Object | null,
}

class AccountPage extends PureComponent<Props, State> {
  state = {
    address: null,
  }

  componentDidMount() {
    this.getWalletInfos()
  }

  componentWillReceiveProps(nextProps) {
    const { currentWallet } = nextProps

    if (currentWallet !== null && !currentWallet.err) {
      this.setState({
        address: currentWallet.data.bitcoinAddress,
      })
    } else {
      this._timeout = setTimeout(() => this.getWalletInfos(), 2e3)
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
  }

  getWalletInfos() {
    const { currentDevice } = this.props

    if (currentDevice !== null) {
      sendEvent('usb', 'wallet.infos.request', {
        path: currentDevice.path,
        wallet: 'btc',
      })
    }
  }

  _timeout = undefined

  render() {
    const { address } = this.state

    return <Box>{address === null ? 'Select Bitcoin App on your Ledger' : address}</Box>
  }
}

export default connect(mapStateToProps)(AccountPage)
