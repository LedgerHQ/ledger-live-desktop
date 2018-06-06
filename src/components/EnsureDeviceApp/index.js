// @flow
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import logger from 'logger'

import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import { getDevices } from 'reducers/devices'
import type { State as StoreState } from 'reducers/index'
import getAddress from 'commands/getAddress'
import isCurrencyAppOpened from 'commands/isCurrencyAppOpened'

import { CHECK_APP_INTERVAL_WHEN_VALID, CHECK_APP_INTERVAL_WHEN_INVALID } from 'config/constants'

type OwnProps = {
  currency?: ?CryptoCurrency,
  deviceSelected: ?Device,
  withGenuineCheck?: boolean,
  account?: ?Account,
  onStatusChange?: (DeviceStatus, AppStatus, ?string) => void,
  onGenuineCheck?: (isGenuine: boolean) => void,
  // TODO prefer children function
  render?: ({
    appStatus: AppStatus,
    genuineCheckStatus: GenuineCheckStatus,
    currency: ?CryptoCurrency,
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

type GenuineCheckStatus = 'success' | 'fail' | 'progress'

type State = {
  deviceStatus: DeviceStatus,
  appStatus: AppStatus,
  errorMessage: ?string,
  genuineCheckStatus: GenuineCheckStatus,
}

const mapStateToProps = (state: StoreState) => ({
  devices: getDevices(state),
})

// TODO we want to split into <EnsureDeviceCurrency/> and <EnsureDeviceAccount/>
// and minimize the current codebase AF
class EnsureDeviceApp extends PureComponent<Props, State> {
  state = {
    appStatus: 'progress',
    deviceStatus: this.props.deviceSelected ? 'connected' : 'unconnected',
    errorMessage: null,
    genuineCheckStatus: 'progress',
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
      // TODO: refacto to more generic/global way
      clearTimeout(this._timeout)
      this._timeout = setTimeout(this.checkAppOpened, 250)
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
    this._unmounted = true
  }

  checkAppOpened = async () => {
    const { deviceSelected, account, currency, withGenuineCheck } = this.props
    const { appStatus } = this.state

    if (!deviceSelected) {
      return
    }

    let isSuccess = true

    try {
      if (account) {
        const { address } = await getAddress
          .send({
            devicePath: deviceSelected.path,
            currencyId: account.currency.id,
            path: account.freshAddressPath,
            segwit: !!account.isSegwit,
          })
          .toPromise()
        const { freshAddress } = account
        if (account && freshAddress !== address) {
          logger.warn({ freshAddress, address })
          throw new Error('Account address is different than device address')
        }
      } else if (currency) {
        const pass = await isCurrencyAppOpened
          .send({
            devicePath: deviceSelected.path,
            currencyId: currency.id,
          })
          .toPromise()
        if (!pass) {
          throw new Error(`${currency.name} app is not opened on the device`)
        }
      } else {
        // TODO: real check if user is on the device dashboard
        if (!deviceSelected) {
          throw new Error('No device')
        }
        await sleep(1) // WTF
      }

      this.handleStatusChange(this.state.deviceStatus, 'success')

      if (withGenuineCheck && appStatus !== 'success') {
        this.handleGenuineCheck()
      }
    } catch (e) {
      this.handleStatusChange(this.state.deviceStatus, 'fail', e.message)
      isSuccess = false
    }

    // TODO: refacto to more generic/global way
    if (!this._unmounted) {
      this._timeout = setTimeout(
        this.checkAppOpened,
        isSuccess ? CHECK_APP_INTERVAL_WHEN_VALID : CHECK_APP_INTERVAL_WHEN_INVALID,
      )
    }
  }

  _timeout: *
  _unmounted = false

  handleStatusChange = (deviceStatus, appStatus, errorMessage = null) => {
    const { onStatusChange } = this.props
    clearTimeout(this._timeout)
    if (!this._unmounted) {
      this.setState({ deviceStatus, appStatus, errorMessage })
      onStatusChange && onStatusChange(deviceStatus, appStatus, errorMessage)
    }
  }

  handleGenuineCheck = async () => {
    // TODO: do a *real* genuine check
    await sleep(1)
    if (!this._unmounted) {
      this.setState({ genuineCheckStatus: 'success' })
      this.props.onGenuineCheck && this.props.onGenuineCheck(true)
    }
  }

  render() {
    const { currency, account, devices, deviceSelected, render } = this.props
    const { appStatus, deviceStatus, genuineCheckStatus, errorMessage } = this.state

    if (render) {
      // if cur is not provided, we assume we want to check if user is on
      // the dashboard
      const cur = account ? account.currency : currency

      return render({
        appStatus,
        currency: cur,
        devices,
        deviceSelected: deviceStatus === 'connected' ? deviceSelected : null,
        deviceStatus,
        genuineCheckStatus,
        errorMessage,
      })
    }

    return null
  }
}

export default connect(mapStateToProps)(EnsureDeviceApp)

async function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1e3))
}
