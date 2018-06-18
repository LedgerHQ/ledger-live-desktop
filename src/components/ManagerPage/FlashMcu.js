// @flow
import React, { PureComponent } from 'react'

import type { Device } from 'types/common'
import installMcu from 'commands/installMcu'

type DeviceInfo = {
  targetId: number | string,
  version: string,
  final: boolean,
  mcu: boolean,
}

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

  componentDidMount() {
    this.flasMCU()
  }

  flasMCU = async () => {
    const { device, deviceInfo } = this.props
    const { flashing } = this.state

    if (!flashing) {
      this.setState(state => ({ ...state, flashing: true }))
      await installMcu.send({ devicePath: device.path, targetId: deviceInfo.targetId }).toPromise()
      this.setState(state => ({ ...state, flashing: false }))
    }
  }

  render() {
    return <div>Flashing MCU</div>
  }
}

export default FlashMcu
