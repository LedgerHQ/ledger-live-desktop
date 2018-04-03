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

type DeviceStatus = 'unconnected' | 'connected'

type AppStatus = 'success' | 'fail' | 'progress'

type Props = {
  coinType: number,
  devices: Devices,
  deviceSelected: Device | null,
  account?: Account,
  onStatusChange?: (DeviceStatus, AppStatus) => void,
  render?: Function,
}

type State = {
  deviceStatus: DeviceStatus,
  appStatus: AppStatus,
}

class DeviceMonit extends PureComponent<Props, State> {
  state = {
    appStatus: 'progress',
    deviceStatus: this.props.deviceSelected ? 'connected' : 'unconnected',
  }

  componentDidMount() {
    ipcRenderer.on('msg', this.handleMsgEvent)
    if (this.props.deviceSelected !== null) {
      this.checkAppOpened()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { deviceStatus } = this.state
    const { deviceSelected, devices } = this.props
    const { devices: nextDevices, deviceSelected: nextDeviceSelected } = nextProps

    if (deviceStatus === 'unconnected' && !deviceSelected && nextDeviceSelected) {
      this.handleStatusChange('connected', 'progress')
    }

    if (deviceStatus !== 'unconnected' && devices !== nextDevices) {
      const isConnected = nextDevices.find(d => d === nextDeviceSelected)
      if (!isConnected) {
        this.handleStatusChange('unconnected', 'progress')
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { deviceSelected } = this.props
    const { deviceSelected: prevDeviceSelected } = prevProps

    if (prevDeviceSelected !== deviceSelected) {
      this.handleStatusChange('connected', 'progress')
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

    if (account) {
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

  handleStatusChange = (deviceStatus, appStatus) => {
    const { onStatusChange } = this.props
    clearTimeout(this._timeout)
    this.setState({ deviceStatus, appStatus })
    onStatusChange && onStatusChange(deviceStatus, appStatus)
  }

  handleMsgEvent = (e, { type, data }) => {
    const { deviceStatus } = this.state
    const { deviceSelected } = this.props

    if (deviceSelected === null) {
      return
    }

    if (type === 'wallet.checkIfAppOpened.success' && deviceSelected.path === data.devicePath) {
      this.handleStatusChange(deviceStatus, 'success')
      this._timeout = setTimeout(this.checkAppOpened, 1e3)
    }

    if (type === 'wallet.checkIfAppOpened.fail' && deviceSelected.path === data.devicePath) {
      this.handleStatusChange(deviceStatus, 'fail')
      this._timeout = setTimeout(this.checkAppOpened, 1e3)
    }
  }

  render() {
    const { coinType, account, devices, deviceSelected, render } = this.props
    const { appStatus, deviceStatus } = this.state

    if (render) {
      return render({
        appStatus,
        coinType: account ? account.coinType : coinType,
        devices,
        deviceSelected: deviceStatus === 'connected' ? deviceSelected : null,
        deviceStatus,
      })
    }

    return null
  }
}

export default connect(mapStateToProps)(DeviceMonit)
