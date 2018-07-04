// @flow

import React, { PureComponent } from 'react'
import invariant from 'invariant'
import { openURL } from 'helpers/linking'
import { urls } from 'config/support'

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

  handleHelpRequest = () => {
    console.log('we are trying')
    openURL(urls.managerHelpRequest)
  }

  render() {
    const { isGenuine, device, deviceInfo } = this.state

    if (!isGenuine) {
      return <ManagerGenuineCheck onSuccess={this.handleSuccessGenuine} />
    }

    invariant(device, 'Inexistant device considered genuine')
    invariant(deviceInfo, 'Inexistant device infos for genuine device')

    return (
      <Dashboard
        device={device}
        deviceInfo={deviceInfo}
        handleHelpRequest={this.handleHelpRequest}
      />
    )
  }
}

export default ManagerPage
