// @flow
/* eslint-disable react/jsx-no-literals */ // FIXME

import React, { PureComponent, Fragment } from 'react'
import { translate } from 'react-i18next'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import invariant from 'invariant'

import type { Device, T } from 'types/common'

import type { LedgerScriptParams } from 'helpers/types'
import type { StepId } from 'components/modals/UpdateFirmware'

import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import shouldFlashMcu from 'commands/shouldFlashMcu'
import installOsuFirmware from 'commands/installOsuFirmware'
import installFinalFirmware from 'commands/installFinalFirmware'
import installMcu from 'commands/installMcu'
import DisclaimerModal from 'components/modals/UpdateFirmware/Disclaimer'
import UpdateModal from 'components/modals/UpdateFirmware'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import Tooltip from 'components/base/Tooltip'
import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'

import NanoS from 'icons/device/NanoS'
import Blue from 'icons/device/Blue'
import CheckFull from 'icons/CheckFull'

import UpdateFirmwareButton from './UpdateFirmwareButton'

export const getCleanVersion = (input: string): string =>
  input.endsWith('-osu') ? input.replace('-osu', '') : input

export type ModalStatus = 'closed' | 'disclaimer' | 'install' | 'error' | 'success'

type Props = {
  t: T,
  deviceInfo: DeviceInfo,
  device: Device,
}

type State = {
  latestFirmware: ?LedgerScriptParams & ?{ shouldFlashMcu: boolean },
  modal: ModalStatus,
  stepId: ?StepId,
  shouldFlash: boolean,
  ready: boolean,
}

const intializeState = ({ deviceInfo }): State => ({
  latestFirmware: null,
  modal: 'closed',
  stepId: deviceInfo.isBootloader ? 'updateMCU' : 'idCheck',
  shouldFlash: false,
  ready: false,
})

class FirmwareUpdate extends PureComponent<Props, State> {
  state = intializeState(this.props)

  componentDidMount() {
    const { deviceInfo } = this.props
    if (!deviceInfo.isOSU && !deviceInfo.isBootloader) {
      this.fetchLatestFirmware()
    } else if (deviceInfo.isOSU) {
      this.shouldFlashMcu()
    } else if (deviceInfo.isBootloader) {
      this.handleInstallModal('updateMCU', true)
    }
  }

  componentWillUnmount() {
    this._unmounting = true
  }

  _unmounting = false

  fetchLatestFirmware = async () => {
    const { deviceInfo } = this.props
    const latestFirmware = await getLatestFirmwareForDevice.send(deviceInfo).toPromise()
    if (
      !isEmpty(latestFirmware) &&
      !isEqual(this.state.latestFirmware, latestFirmware) &&
      !this._unmounting
    ) {
      this.setState({ latestFirmware, ready: true })
    }
  }

  shouldFlashMcu = async () => {
    const { deviceInfo } = this.props
    const shouldFlash = await shouldFlashMcu.send(deviceInfo).toPromise()
    if (!this._unmounting) {
      this.setState({ shouldFlash, modal: 'install', stepId: 'idCheck', ready: true })
    }
  }

  installOsuFirmware = async (device: Device) => {
    const { latestFirmware } = this.state
    const { deviceInfo } = this.props
    invariant(latestFirmware, 'did not find a new firmware or firmware is not set')

    this.setState({ modal: 'install' })
    const result = await installOsuFirmware
      .send({ devicePath: device.path, firmware: latestFirmware, targetId: deviceInfo.targetId })
      .toPromise()

    return result
  }

  installFinalFirmware = (device: Device) =>
    installFinalFirmware.send({ devicePath: device.path }).toPromise()

  flashMCU = async (device: Device) => installMcu.send({ devicePath: device.path }).toPromise()

  handleCloseModal = () => this.setState({ modal: 'closed' })

  handleDisclaimerModal = () => this.setState({ modal: 'disclaimer' })
  handleInstallModal = (stepId: StepId = 'idCheck', shouldFlash?: boolean) =>
    this.setState({ modal: 'install', stepId, shouldFlash, ready: true })

  handleDisclaimerNext = () => this.setState({ modal: 'install' })

  render() {
    const { deviceInfo, t, device } = this.props
    const { latestFirmware, modal, stepId, shouldFlash, ready } = this.state
    return (
      <Card p={4}>
        <Box horizontal align="center" flow={2}>
          <Box color="dark">
            {device.product === 'Blue' ? <Blue size={30} /> : <NanoS size={30} />}
          </Box>
          <Box>
            <Box horizontal align="center">
              <Text ff="Open Sans|SemiBold" fontSize={4} color="dark">
                {device.product === 'Blue'
                  ? t('app:manager.firmware.titleBlue')
                  : t('app:manager.firmware.titleNano')}
              </Text>
              <Box color="wallet" ml={2}>
                <Tooltip render={() => t('app:manager.yourDeviceIsGenuine')}>
                  <CheckFull size={13} color="wallet" />
                </Tooltip>
              </Box>
            </Box>
            <Text ff="Open Sans|SemiBold" fontSize={2}>
              {t('app:manager.firmware.installed', {
                version: deviceInfo.fullVersion,
              })}
            </Text>
          </Box>
          <UpdateFirmwareButton firmware={latestFirmware} onClick={this.handleDisclaimerModal} />
        </Box>
        {ready ? (
          <Fragment>
            <DisclaimerModal
              firmware={latestFirmware}
              status={modal}
              goToNextStep={this.handleDisclaimerNext}
              onClose={this.handleCloseModal}
            />
            <UpdateModal
              status={modal}
              stepId={stepId}
              onClose={this.handleCloseModal}
              firmware={latestFirmware}
              shouldFlashMcu={shouldFlash}
              installOsuFirmware={this.installOsuFirmware}
              installFinalFirmware={this.installFinalFirmware}
              flashMCU={this.flashMCU}
            />
          </Fragment>
        ) : null}
      </Card>
    )
  }
}

export default translate()(FirmwareUpdate)
