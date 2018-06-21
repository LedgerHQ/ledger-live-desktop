// @flow
import { PureComponent } from 'react'
import isEqual from 'lodash/isEqual'

import type { Node } from 'react'
import type { Device } from 'types/common'

import getDeviceInfo from 'commands/getDeviceInfo'

type DeviceInfo = {
  targetId: number | string,
  version: string,
  final: boolean,
  mcu: boolean,
}

type Error = {
  message: string,
  stack: string,
}

type Props = {
  device: ?Device,
  children: (deviceInfo: ?DeviceInfo, error: ?Error) => Node,
}

type State = {
  deviceInfo: ?DeviceInfo,
  error: ?Error,
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

  componentDidUpdate({ device }: Props) {
    if (this.props.device !== device && this.props.device) {
      this.checkForDashboard()
    }
  }

  componentWillUnmount() {
    this._unmounting = true
  }

  _checking = false
  _unmounting = false

  checkForDashboard = async () => {
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

    return children(deviceInfo, error)
  }
}

export default EnsureDashboard
