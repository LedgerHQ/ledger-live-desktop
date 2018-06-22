// @flow
import React, { PureComponent } from 'react'

import type { Device } from 'types/common'
import installMcu from 'commands/installMcu'

import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
}

type State = {
  flashing: boolean,
}

class FlashMcu extends PureComponent<Props, State> {
  state = {
    flashing: false,
  }

  flashMCU = async () => {
    const { device, deviceInfo } = this.props
    const { flashing } = this.state

    if (!flashing) {
      this.setState({ flashing: true })
      await installMcu
        .send({
          devicePath: device.path,
          targetId: deviceInfo.targetId,
          version: deviceInfo.seVersion,
        })
        .toPromise()
      this.setState({ flashing: false })
    }
  }

  render() {
    return (
      <div>
        <h1>Flashing MCU</h1>
        <button onClick={this.flashMCU}>flash</button>
      </div>
    )
  }
}

export default FlashMcu
