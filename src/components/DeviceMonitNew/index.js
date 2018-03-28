// @flow

import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import type { Account } from '@ledgerhq/wallet-common/lib/types'
import type { Device, Devices } from 'types/common'

import { sendEvent } from 'renderer/events'
import { getDevices, getCurrentDevice } from 'reducers/devices'

const mapStateToProps = (state, props) => ({
  devices: getDevices(state),
  currentDevice: props.device || getCurrentDevice(state),
})

type DeviceStatus = 'unconnected' | 'connected' | 'appOpened.success' | 'appOpened.fail'

type Props = {
  coinType: number,
  devices: Devices,
  currentDevice: Device | null,
  account?: Account,
  onStatusChange?: DeviceStatus => void,
  render?: Function,
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
    const { currentDevice, account, coinType } = this.props

    if (currentDevice === null) {
      return
    }

    let options = null

    if (account && account.currency) {
      options = {
        accountPath: account.path,
        accountAddress: account.address,
      }
    }

    if (coinType) {
      options = {
        coinType,
      }
    }

    sendEvent('usb', 'wallet.checkIfAppOpened', {
      devicePath: currentDevice.path,
      ...options,
    })
  }

  _timeout: any = null

  handleStatusChange = status => {
    const { onStatusChange } = this.props
    this.setState({ status })
    onStatusChange && onStatusChange(status)
  }

  handleMsgEvent = (e, { type }) => {
    if (type === 'wallet.checkIfAppOpened.success') {
      this.handleStatusChange('appOpened.success')
      clearTimeout(this._timeout)
    }

    if (type === 'wallet.checkIfAppOpened.fail') {
      this.handleStatusChange('appOpened.fail')
      this._timeout = setTimeout(this.checkAppOpened, 1e3)
    }
  }

  render() {
    const { status } = this.state
    const { devices, currentDevice, render } = this.props

    if (render) {
      return render({ status, devices, currentDevice })
    }

    return null
  }
}

export default connect(mapStateToProps)(DeviceMonit)
