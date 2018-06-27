// @flow

import React, { PureComponent } from 'react'
import invariant from 'invariant'

import type { Device } from 'types/common'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import Dashboard from './Dashboard'

import ManagerGenuineCheck from './ManagerGenuineCheck'

type Props = {}

type State = {
  isGenuine: ?boolean,
  device: ?Device,
  deviceInfo: ?DeviceInfo,
}

class ManagerPage extends PureComponent<Props, State> {
  state = {
    isGenuine: null,
    device: null,
    deviceInfo: null,
  }

  // prettier-ignore
  handleSuccessGenuine = ({ device, deviceInfo }: { device: Device, deviceInfo: DeviceInfo }) => { // eslint-disable-line react/no-unused-prop-types
    this.setState({ isGenuine: true, device, deviceInfo })
  }

  render() {
    const { isGenuine, device, deviceInfo } = this.state

    if (!isGenuine) {
      return <ManagerGenuineCheck onSuccess={this.handleSuccessGenuine} />
    }

    invariant(device, 'Inexistant device considered genuine')
    invariant(deviceInfo, 'Inexistant device infos for genuine device')

    // TODO
    // renderFinalUpdate
    // renderMcuUpdate

    return <Dashboard device={device} deviceInfo={deviceInfo} />
  }
}

export default ManagerPage
