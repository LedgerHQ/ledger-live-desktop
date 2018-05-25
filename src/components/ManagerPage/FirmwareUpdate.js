// @flow

import React, { PureComponent } from 'react'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import type { Device, T } from 'types/common'

import runJob from 'renderer/runJob'
import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'

// let CACHED_LATEST_FIRMWARE = null

type FirmwareInfos = {
  name: string,
  notes: string,
}

type DeviceInfos = {
  targetId: number,
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
    if (/* !CACHED_LATEST_FIRMWARE || */ isEmpty(this.state.latestFirmware)) {
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
      // CACHED_LATEST_FIRMWARE ||
      await getLatestFirmwareForDevice
        .send({ targetId: infos.targetId, version: infos.version })
        .toPromise()
    if (
      !isEmpty(latestFirmware) &&
      !isEqual(this.state.latestFirmware, latestFirmware) &&
      !this._unmounting
    ) {
      // CACHED_LATEST_FIRMWARE = latestFirmware
      this.setState({ latestFirmware })
    }
  }

  installFirmware = async () => {
    try {
      const { latestFirmware } = this.state
      const {
        device: { path: devicePath },
      } = this.props
      await runJob({
        channel: 'manager',
        job: 'installOsuFirmware',
        successResponse: 'device.osuFirmwareInstallSuccess',
        errorResponse: 'device.osuFirmwareInstallError',
        data: {
          devicePath,
          firmware: latestFirmware,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { t, ...props } = this.props
    const { latestFirmware } = this.state

    if (!latestFirmware) {
      return null
    }

    return (
      <Box flow={4} {...props}>
        <Box color="dark" ff="Museo Sans" fontSize={6}>
          {t('manager:firmwareUpdate')}
        </Box>
        <Card flow={2} {...props}>
          <Box horizontal align="center" flow={2}>
            <Box ff="Museo Sans">{`Latest firmware: ${latestFirmware.name}`}</Box>
            <Button outline onClick={this.installFirmware}>
              {'Install'}
            </Button>
          </Box>
          <Box
            fontSize={3}
            style={{ whiteSpace: 'pre' }}
            dangerouslySetInnerHTML={{ __html: latestFirmware.notes }}
          />
        </Card>
      </Box>
    )
  }
}

export default FirmwareUpdate
