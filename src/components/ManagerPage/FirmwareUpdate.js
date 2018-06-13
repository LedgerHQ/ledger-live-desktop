// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import invariant from 'invariant'
import logger from 'logger'

import type { Device, T } from 'types/common'

import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import installOsuFirmware from 'commands/installOsuFirmware'

import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'

import NanoS from 'icons/device/NanoS'
import CheckFull from 'icons/CheckFull'

import UpdateFirmwareButton from './UpdateFirmwareButton'

let CACHED_LATEST_FIRMWARE = null

type FirmwareInfos = {
  name: string,
  notes: string,
}

type DeviceInfos = {
  targetId: number | string,
  version: string,
}

type Props = {
  t: T,
  device: Device,
  infos: DeviceInfos,
}

type State = {
  latestFirmware: ?FirmwareInfos,
}

class FirmwareUpdate extends PureComponent<Props, State> {
  state = {
    latestFirmware: null,
  }

  componentDidMount() {
    this.fetchLatestFirmware()
  }

  componentDidUpdate() {
    if (!CACHED_LATEST_FIRMWARE || isEmpty(this.state.latestFirmware)) {
      this.fetchLatestFirmware()
    }
  }

  componentWillUnmount() {
    this._unmounting = true
  }

  _unmounting = false

  fetchLatestFirmware = async () => {
    const { infos } = this.props
    const latestFirmware =
      CACHED_LATEST_FIRMWARE ||
      (await getLatestFirmwareForDevice
        .send({ targetId: infos.targetId, version: infos.version })
        .toPromise())
    if (
      !isEmpty(latestFirmware) &&
      !isEqual(this.state.latestFirmware, latestFirmware) &&
      !this._unmounting
    ) {
      CACHED_LATEST_FIRMWARE = latestFirmware
      this.setState({ latestFirmware })
    }
  }

  installFirmware = async () => {
    try {
      const { latestFirmware } = this.state
      invariant(latestFirmware, 'did not find a new firmware or firmware is not set')
      const {
        device: { path: devicePath },
      } = this.props
      const { success } = await installOsuFirmware
        .send({ devicePath, firmware: latestFirmware })
        .toPromise()
      if (success) {
        this.fetchLatestFirmware()
      }
    } catch (err) {
      logger.log(err)
    }
  }

  render() {
    const { infos, t } = this.props
    const { latestFirmware } = this.state

    return (
      <Card px={4} py={25}>
        <Box horizontal align="center" flow={2}>
          <Box color="dark">
            <NanoS size={30} />
          </Box>
          <Box>
            <Box horizontal align="center">
              <Text ff="Open Sans|SemiBold" fontSize={4} color="dark">
                Ledger Nano S
              </Text>
              <Box color="wallet" style={{ marginLeft: 10 }}>
                <CheckFull size={13} color="wallet" />
              </Box>
            </Box>
            <Text ff="Open Sans|SemiBold" fontSize={2}>
              {t('app:manager.firmware.installed', { version: infos.version })}
            </Text>
          </Box>
          <UpdateFirmwareButton firmware={latestFirmware} installFirmware={this.installFirmware} />
        </Box>
      </Card>
    )
  }
}

export default translate()(FirmwareUpdate)
