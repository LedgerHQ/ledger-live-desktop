// @flow

import React, { PureComponent } from 'react'
import isEqual from 'lodash/isEqual'

import type { Device, T } from 'types/common'

import runJob from 'renderer/runJob'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'

const CACHED_LATEST_FIRMWARE = null

type FirmwareInfos = {
  name: string,
  notes: string,
}

type DeviceInfos = {
  final: boolean,
  mcu: boolean,
  targetId: number,
  version: string,
}

type Props = {
  t: T,
  device: Device,
}

type State = {
  latestFirmware: ?FirmwareInfos,
  deviceInfos: ?DeviceInfos,
  installing: boolean,
}

class FirmwareUpdate extends PureComponent<Props, State> {
  state = {
    latestFirmware: null,
    deviceInfos: null,
    installing: false,
  }

  componentDidMount() {
    this.fetchLatestFirmware(true)
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!isEqual(prevState.deviceInfos, this.state.deviceInfos)) {
      this.fetchDeviceInfos()
    } else if (this.state.installing) {
      this.installFirmware()
    }
  }

  componentWillUnmount() {
    this._unmounted = true
  }

  _unmounted = false

  fetchLatestFirmware = async (checkDeviceInfos: boolean = false) => {
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

    if (checkDeviceInfos) {
      await this.fetchDeviceInfos()
    }

    // CACHED_LATEST_FIRMWARE = latestFirmware
    if (!this._unmounted) {
      this.setState({ latestFirmware })
    }
  }

  fetchDeviceInfos = async () => {
    const { device } = this.props
    const deviceInfos = await runJob({
      channel: 'manager',
      job: 'getFirmwareInfo', // TODO: RENAME THIS PROCESS DIFFERENTLY (EG: getInstallStep)
      data: { devicePath: device.path },
      successResponse: 'device.getFirmwareInfoSuccess',
      errorResponse: 'device.getFirmwareInfoError',
    })

    if (!this._unmounted) {
      this.setState(state => ({ ...state, deviceInfos }))
    }
  }

  handleIntallOsuFirmware = async () => {
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

  handleIntallFinalFirmware = async () => {
    try {
      const { latestFirmware } = this.state
      this.setState(state => ({ ...state, installing: true }))
      const {
        device: { path: devicePath },
      } = this.props
      await runJob({
        channel: 'manager',
        job: 'installFinalFirmware',
        successResponse: 'device.finalFirmwareInstallSuccess',
        errorResponse: 'device.finalFirmwareInstallError',
        data: {
          devicePath,
          firmware: latestFirmware,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  handleIntallMcu = async () => {}

  installFirmware = async () => {
    const { deviceInfos } = this.state
    if (deviceInfos) {
      const { mcu, final } = deviceInfos
      if (mcu) {
        this.handleIntallMcu()
      } else if (final) {
        this.handleIntallFinalFirmware()
      } else {
        this.handleIntallOsuFirmware()
      }
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
            <Button outline onClick={this.handleInstallFirmware}>
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
