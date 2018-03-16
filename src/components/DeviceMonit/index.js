// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import { sendEvent } from 'renderer/events'
import { getCurrentDevice } from 'reducers/devices'
import type { Device, Account } from 'types/common'

const mapStateToProps = state => ({
  currentDevice: getCurrentDevice(state),
})

type DeviceStatus = 'unconnected' | 'connected' | 'appOpened'

type Props = {
  currentDevice: Device | null,
  account: Account,
  onStatusChange: DeviceStatus => void,
}

type State = {
  status: DeviceStatus,
}

class DeviceMonit extends PureComponent<Props, State> {
  state = {
    status: this.props.currentDevice ? 'connected' : 'unconnected',
  }

  componentDidMount() {
    ipcRenderer.on('msg', this.handleMsgEvent)
    if (this.props.currentDevice !== null) {
      this.checkAppOpened()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.state
    const { currentDevice } = this.props
    const { currentDevice: nextCurrentDevice } = nextProps

    if (status === 'unconnected' && !currentDevice && nextCurrentDevice) {
      this.handleStatusChange('connected')
    }

    if (status !== 'unconnected' && !nextCurrentDevice) {
      this.handleStatusChange('unconnected')
    }
  }

  componentDidUpdate() {
    const { currentDevice } = this.props

    if (currentDevice !== null) {
      this.checkAppOpened()
    } else {
      clearTimeout(this._timeout)
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('msg', this.handleMsgEvent)
    clearTimeout(this._timeout)
  }

  checkAppOpened = () => {
    const { currentDevice, account } = this.props

    if (currentDevice === null || account.currency === null) {
      return
    }

    sendEvent('usb', 'wallet.checkIfAppOpened', {
      devicePath: currentDevice.path,
      accountPath: account.path,
      accountAddress: account.address,
    })
  }

  _timeout: any = null

  handleStatusChange = status => {
    this.setState({ status })
    this.props.onStatusChange(status)
  }

  handleMsgEvent = (e, { type }) => {
    if (type === 'wallet.checkIfAppOpened.success') {
      this.handleStatusChange('appOpened')
      clearTimeout(this._timeout)
    }

    if (type === 'wallet.checkIfAppOpened.fail') {
      this._timeout = setTimeout(this.checkAppOpened, 1e3)
    }
  }

  render() {
    const { status } = this.state
    return (
      <div>
        <div>device connected {status !== 'unconnected' ? 'TRUE' : 'FALSE'}</div>
        <div>app opened {status === 'appOpened' ? 'TRUE' : 'FALSE'}</div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(DeviceMonit)
