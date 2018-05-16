// @flow

import React, { PureComponent } from 'react'

import type { Device, T } from 'types/common'

import runJob from 'renderer/runJob'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'

const CACHED_LATEST_FIRMWARE = null

type FirmwareInfos = {
  name: string,
  notes: string,
}

type Props = {
  t: T,
  device: Device,
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

  componentWillUnmount() {
    this._unmounted = true
  }

  _unmounted = false

  fetchLatestFirmware = async () => {
    const { device } = this.props
    const latestFirmware =
      CACHED_LATEST_FIRMWARE ||
      (await runJob({
        channel: 'manager',
        job: 'getLatestFirmwareForDevice',
        data: { devicePath: device.path },
        successResponse: 'manager.getLatestFirmwareForDeviceSuccess',
        errorResponse: 'manager.getLatestFirmwareForDeviceError',
      }))
    // CACHED_LATEST_FIRMWARE = latestFirmware
    console.log(latestFirmware)
    if (!this._unmounted) {
      this.setState({ latestFirmware })
    }
  }

  handleInstallFirmware = async () => {
    try {
      const { latestFirmware } = this.state
      console.log(latestFirmware)
      const {
        device: { path: devicePath },
      } = this.props
      await runJob({
        channel: 'manager',
        job: 'installFirmware',
        successResponse: 'device.firmwareInstalled',
        errorResponse: 'device.firmwareInstallError',
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
            <Button outline onClick={this.fetchLatestFirmware}>
              {'Fetch'}
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
