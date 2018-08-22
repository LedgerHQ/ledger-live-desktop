// @flow

import React, { PureComponent, Fragment } from 'react'
import invariant from 'invariant'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'

import type { Device } from 'types/common'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import Dashboard from './Dashboard'

import ManagerGenuineCheck from './ManagerGenuineCheck'
import HookDeviceChange from './HookDeviceChange'

type Props = {}

type State = {
  isGenuine: ?boolean,
  device: ?Device,
  deviceInfo: ?DeviceInfo,
}

const INITIAL_STATE = {
  isGenuine: null,
  device: null,
  deviceInfo: null,
}

class ManagerPage extends PureComponent<Props, State> {
  state = INITIAL_STATE

  // prettier-ignore
  handleSuccessGenuine = ({ device, deviceInfo }: { device: Device, deviceInfo: DeviceInfo }) => { // eslint-disable-line react/no-unused-prop-types
    this.setState({ isGenuine: true, device, deviceInfo })
  }

  handleHelpRequest = () => {
    openURL(urls.managerHelpRequest)
  }

  onDeviceChanges = () => {
    this.setState(INITIAL_STATE)
  }

  onDeviceDisconnected = () => {
    this.setState(INITIAL_STATE)
  }

  render() {
    const { isGenuine, device, deviceInfo } = this.state

    if (!isGenuine) {
      return <ManagerGenuineCheck onSuccess={this.handleSuccessGenuine} />
    }

    invariant(device, 'Inexistant device considered genuine')
    invariant(deviceInfo, 'Inexistant device infos for genuine device')

    return (
      <Fragment>
        <HookDeviceChange
          onDeviceChanges={this.onDeviceChanges}
          onDeviceDisconnected={this.onDeviceDisconnected}
        />
        <Dashboard
          device={device}
          deviceInfo={deviceInfo}
          handleHelpRequest={this.handleHelpRequest}
        />
      </Fragment>
    )
  }
}

export default ManagerPage
