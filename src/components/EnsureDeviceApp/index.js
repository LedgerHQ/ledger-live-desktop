// @flow
import invariant from 'invariant'
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { standardDerivation } from 'helpers/derivations'

import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import { getDevices } from 'reducers/devices'
import type { State as StoreState } from 'reducers/index'
import getAddress from 'commands/getAddress'

type OwnProps = {
  currency: ?CryptoCurrency,
  deviceSelected: ?Device,
  account: ?Account,
  onStatusChange?: (DeviceStatus, AppStatus, ?string) => void,
  // TODO prefer children function
  render?: ({
    appStatus: AppStatus,
    currency: CryptoCurrency,
    devices: Device[],
    deviceSelected: ?Device,
    deviceStatus: DeviceStatus,
    errorMessage: ?string,
  }) => React$Element<*>,
}

type Props = OwnProps & {
  devices: Device[],
}

type DeviceStatus = 'unconnected' | 'connected'

type AppStatus = 'success' | 'fail' | 'progress'

type State = {
  deviceStatus: DeviceStatus,
  appStatus: AppStatus,
  errorMessage: ?string,
}

const mapStateToProps = (state: StoreState) => ({
  devices: getDevices(state),
})

class EnsureDeviceApp extends PureComponent<Props, State> {
  state = {
    appStatus: 'progress',
    deviceStatus: this.props.deviceSelected ? 'connected' : 'unconnected',
    errorMessage: null,
  }

  componentDidMount() {
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
    clearTimeout(this._timeout)
  }

  checkAppOpened = async () => {
    const { deviceSelected, account, currency } = this.props

    if (!deviceSelected) {
      return
    }

    let options

    if (account) {
      options = {
        devicePath: deviceSelected.path,
        currencyId: account.currency.id,
        path: account.freshAddressPath,
        accountAddress: account.freshAddress,
        segwit: !!account.isSegwit,
      }
    } else if (currency) {
      options = {
        devicePath: deviceSelected.path,
        currencyId: currency.id,
        path: standardDerivation({ currency, x: 0, segwit: false }),
      }
    } else {
      throw new Error('either currency or account is required')
    }

    try {
      const { address } = await getAddress.send(options).toPromise()
      if (account && account.freshAddress !== address) {
        throw new Error('Account address is different than device address')
      }
      this.handleStatusChange(this.state.deviceStatus, 'success')
    } catch (e) {
      this.handleStatusChange(this.state.deviceStatus, 'fail', e.message)
    }

    this._timeout = setTimeout(this.checkAppOpened, 1e3)
  }

  _timeout: *

  handleStatusChange = (deviceStatus, appStatus, errorMessage = null) => {
    const { onStatusChange } = this.props
    clearTimeout(this._timeout)
    this.setState({ deviceStatus, appStatus, errorMessage })
    onStatusChange && onStatusChange(deviceStatus, appStatus, errorMessage)
  }

  render() {
    const { currency, account, devices, deviceSelected, render } = this.props
    const { appStatus, deviceStatus, errorMessage } = this.state

    if (render) {
      const cur = account ? account.currency : currency
      invariant(cur, 'currency is either provided or taken from account')
      return render({
        appStatus,
        currency: cur,
        devices,
        deviceSelected: deviceStatus === 'connected' ? deviceSelected : null,
        deviceStatus,
        errorMessage,
      })
    }

    return null
  }
}

export default connect(mapStateToProps)(EnsureDeviceApp)
