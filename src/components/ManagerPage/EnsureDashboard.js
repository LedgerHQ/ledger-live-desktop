// @flow
import React, { PureComponent, Fragment } from 'react'
import { translate } from 'react-i18next'
import isEqual from 'lodash/isEqual'

// import type { Device, T } from 'types/common'
import type { Device } from 'types/common'

import getDeviceInfo from 'commands/getDeviceInfo'

type DeviceInfo = {
  targetId: number | string,
  version: string,
  final: boolean,
  mcu: boolean,
}

type Props = {
  // t: T,
  device: Device,
  children: Function,
}

type State = {
  deviceInfo: ?DeviceInfo,
  error: ?{
    message: string,
    stack: string,
  },
}

class EnsureDashboard extends PureComponent<Props, State> {
  static defaultProps = {
    children: null,
    device: null,
  }

  state = {
    deviceInfo: null,
    error: null,
  }

  componentDidMount() {
    this.checkForDashboard()
  }

  componentDidUpdate() {
    this.checkForDashboard()
  }

  componentWillUnmount() {
    this._unmounting = true
  }

  _checking = false
  _unmounting = false

  async checkForDashboard() {
    const { device } = this.props
    if (device && !this._checking) {
      this._checking = true
      try {
        const deviceInfo = await getDeviceInfo.send({ devicePath: device.path }).toPromise()
        if (!isEqual(this.state.deviceInfo, deviceInfo) || this.state.error) {
          !this._unmounting && this.setState({ deviceInfo, error: null })
        }
      } catch (err) {
        if (!isEqual(err, this.state.error)) {
          !this._unmounting && this.setState({ error: err, deviceInfo: null })
        }
      }
      this._checking = false
    }
  }

  render() {
    const { deviceInfo, error } = this.state
    const { children } = this.props

    if (deviceInfo) {
      return children(deviceInfo)
    }

    return error ? (
      <Fragment>
        <span>{error.message}</span>
        <span>Please make sure your device is on the dashboard screen</span>
      </Fragment>
    ) : null
  }
}

export default translate()(EnsureDashboard)
