// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import logger from 'logger'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import type { Device, T } from 'types/common'

import installFinalFirmware from 'commands/installFinalFirmware'

import Box, { Card } from 'components/base/Box'
// import Button from 'components/base/Button'

type Props = {
  t: T,
  device: Device,
  deviceInfo: DeviceInfo,
}

type State = {}

class FirmwareFinalUpdate extends PureComponent<Props, State> {
  componentDidMount() {}

  componentWillUnmount() {
    this._unmounting = true
  }

  _unmounting = false

  installFinalFirmware = async () => {
    try {
      const { device, deviceInfo } = this.props
      const { success } = await installFinalFirmware
        .send({ devicePath: device.path, deviceInfo })
        .toPromise()
      if (success) {
        this.setState()
      }
    } catch (err) {
      logger.log(err)
    }
  }

  render() {
    const { t, ...props } = this.props

    return (
      <Box flow={4} {...props}>
        <Box color="dark" ff="Museo Sans" fontSize={6}>
          {t('app:manager.firmware.update')}
        </Box>
        <Card flow={2} {...props}>
          <Box horizontal align="center" flow={2} />
        </Card>
      </Box>
    )
  }
}

export default translate()(FirmwareFinalUpdate)
