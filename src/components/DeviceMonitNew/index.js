// @flow

import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import type { Account } from '@ledgerhq/wallet-common/lib/types'
import type { Device, Devices } from 'types/common'

import { sendEvent } from 'renderer/events'
import { getDevices } from 'reducers/devices'

const mapStateToProps = state => ({
  devices: getDevices(state),
})

type DeviceStatus =
  | 'unconnected'
  | 'connected'
  | 'appOpened.success'
  | 'appOpened.fail'
  | 'appOpened.progress'

type Props = {
  coinType: number,
  devices: Devices,
  deviceSelected: Device | null,
  account?: Account,
  onStatusChange?: DeviceStatus => void,
  render?: Function,
}

type State = {
  status: DeviceStatus,
}

class DeviceMonit extends PureComponent<Props, State> {
  state = {
    status: this.props.deviceSelected ? 'connected' : 'unconnected',
  }

  componentDidMount() {
    ipcRenderer.on('msg', this.handleMsgEvent)
    if (this.props.deviceSelected !== null) {
      this.checkAppOpened()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.state
    const { deviceSelected, devices } = this.props
    const { devices: nextDevices, deviceSelected: nextDeviceSelected } = nextProps

    if (status === 'unconnected' && !deviceSelected && nextDeviceSelected) {
      this.handleStatusChange('connected')
    }

    if (status !== 'unconnected' && devices !== nextDevices) {
      const isConnected = nextDevices.find(d => d === nextDeviceSelected)
      if (!isConnected) {
        this.handleStatusChange('unconnected')
        clearTimeout(this._timeout)
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { deviceSelected } = this.props
    const { deviceSelected: prevDeviceSelected } = prevProps

    if (prevDeviceSelected !== deviceSelected) {
      this.handleStatusChange('appOpened.progress')
      this._timeout = setTimeout(this.checkAppOpened, 250)
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('msg', this.handleMsgEvent)
    clearTimeout(this._timeout)
  }

  checkAppOpened = () => {
    const { deviceSelected, account, coinType } = this.props

    if (deviceSelected === null) {
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
      devicePath: deviceSelected.path,
      ...options,
    })
  }

  _timeout: any = null

  handleStatusChange = status => {
    const { onStatusChange } = this.props
    this.setState({ status })
    onStatusChange && onStatusChange(status)
  }

  handleMsgEvent = (e, { type, data }) => {
    const { deviceSelected } = this.props

    if (deviceSelected === null) {
      return
    }

    if (type === 'wallet.checkIfAppOpened.success' && deviceSelected.path === data.devicePath) {
      clearTimeout(this._timeout)
      this.handleStatusChange('appOpened.success')
    }

    if (type === 'wallet.checkIfAppOpened.fail' && deviceSelected.path === data.devicePath) {
      this.handleStatusChange('appOpened.fail')
      this._timeout = setTimeout(this.checkAppOpened, 1e3)
    }
  }

  render() {
    const { status } = this.state
    const { devices, deviceSelected, render } = this.props

    if (render) {
      return render({
        status,
        devices,
        deviceSelected: status === 'connected' ? deviceSelected : null,
      })
    }

    return null
  }
}

export default connect(mapStateToProps)(DeviceMonit)
