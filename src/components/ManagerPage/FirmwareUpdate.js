// @flow

import logger from 'logger'
import React, { PureComponent, Fragment } from 'react'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import type { Device, T } from 'types/common'

import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import installOsuFirmware from 'commands/installOsuFirmware'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'
import Text from 'components/base/Text'

import NanoS from 'icons/device/NanoS'
import CheckFull from 'icons/CheckFull'

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

const UpdateButton = ({
  t,
  firmware,
  installFirmware,
}: {
  t: T,
  firmware: ?FirmwareInfos,
  installFirmware: (firmware: FirmwareInfos) => *,
}) =>
  firmware ? (
    <Fragment>
      <Text ff="Open Sans|Regular" fontSize={4} style={{ marginLeft: 'auto', marginRight: 15 }}>
        {t('manager:latestFirmware', { version: firmware.name })}
      </Text>
      <Button primary onClick={installFirmware(firmware)}>
        {t('manager:installFirmware')}
      </Button>
    </Fragment>
  ) : null

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

  installFirmware = (firmware: FirmwareInfos) => async () => {
    try {
      const {
        device: { path: devicePath },
      } = this.props
      const { success } = await installOsuFirmware.send({ devicePath, firmware }).toPromise()
      if (success) {
        this.fetchLatestFirmware()
      }
    } catch (err) {
      logger.log(err)
    }
  }

  render() {
    const { t, infos } = this.props
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
              Firmware {infos.version}
            </Text>
          </Box>
          <UpdateButton t={t} firmware={latestFirmware} installFirmware={this.installFirmware} />
        </Box>
      </Card>
    )
  }
}

export default FirmwareUpdate
