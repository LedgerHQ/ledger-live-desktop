// @flow
import invariant from 'invariant'
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { Device, Devices } from 'types/common'

import { sendEvent } from 'renderer/events'
import { getDevices } from 'reducers/devices'
import type { State as StoreState } from 'reducers/index'

type OwnProps = {
  currency: ?CryptoCurrency,
  deviceSelected: ?Device,
  account: ?Account,
  onStatusChange?: (DeviceStatus, AppStatus) => void,
  // TODO prefer children function
  render?: ({
    appStatus: AppStatus,
    currency: CryptoCurrency,
    devices: Devices,
    deviceSelected: ?Device,
    deviceStatus: DeviceStatus,
  }) => React$Element<*>,
}

type Props = OwnProps & {
  devices: Devices,
}

type DeviceStatus = 'unconnected' | 'connected'

type AppStatus = 'success' | 'fail' | 'progress'

type State = {
  deviceStatus: DeviceStatus,
  appStatus: AppStatus,
}

const mapStateToProps = (state: StoreState) => ({
  devices: getDevices(state),
})

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
    const { deviceSelected, account, currency } = this.props

    if (!deviceSelected) {
      return
    }

    let options = null

    if (account) {
      options = {
        accountPath: account.path,
        accountAddress: account.address,
        segwit: account.path.startsWith("49'"), // TODO: store segwit info in account
      }
    }

    if (currency) {
      options = {
        currencyId: currency.id,
      }
    }

    sendEvent('usb', 'wallet.checkIfAppOpened', {
      devicePath: deviceSelected.path,
      ...options,
    })
  }

  _timeout: *

  handleStatusChange = (deviceStatus, appStatus) => {
    const { onStatusChange } = this.props
    clearTimeout(this._timeout)
    this.setState({ deviceStatus, appStatus })
    onStatusChange && onStatusChange(deviceStatus, appStatus)
  }

  handleMsgEvent = (e, { type, data }) => {
    const { deviceStatus } = this.state
    const { deviceSelected } = this.props

    if (!deviceSelected) {
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
    const { currency, account, devices, deviceSelected, render } = this.props
    const { appStatus, deviceStatus } = this.state

    if (render) {
      const cur = account ? account.currency : currency
      invariant(cur, 'currency is either provided or taken from account')
      return render({
        appStatus,
        currency: cur,
        devices,
        deviceSelected: deviceStatus === 'connected' ? deviceSelected : null,
        deviceStatus,
      })
    }

    return null
  }
}

export default connect(mapStateToProps)(DeviceMonit)
