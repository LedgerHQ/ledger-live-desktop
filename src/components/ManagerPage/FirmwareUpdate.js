// @flow
/* eslint-disable react/jsx-no-literals */ // FIXME

import React, { PureComponent, Fragment } from 'react'
import { translate } from 'react-i18next'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import invariant from 'invariant'
import logger from 'logger'

import type { Device, T } from 'types/common'

import type { LedgerScriptParams } from 'helpers/common'

import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
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
import CheckFull from 'icons/CheckFull'

import { PreventDeviceChangeRecheck } from 'components/EnsureDevice'
import UpdateFirmwareButton from './UpdateFirmwareButton'

export const getCleanVersion = (input: string): string =>
  input.endsWith('-osu') ? input.replace('-osu', '') : input

export type ModalStatus = 'closed' | 'disclaimer' | 'install' | 'error' | 'success'

type Props = {
  t: T,
  deviceInfo: DeviceInfo,
}

type State = {
  latestFirmware: ?LedgerScriptParams & ?{ shouldUpdateMcu: boolean },
  modal: ModalStatus,
}

class FirmwareUpdate extends PureComponent<Props, State> {
  state = {
    latestFirmware: null,
    modal: 'closed',
  }

  componentDidMount() {
    this.fetchLatestFirmware()
  }

  componentDidUpdate() {
    if (isEmpty(this.state.latestFirmware)) {
      this.fetchLatestFirmware()
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
      this.setState({ latestFirmware })
    }
  }

  installOsuFirmware = async (device: Device) => {
    try {
      const { latestFirmware } = this.state
      const { deviceInfo } = this.props
      invariant(latestFirmware, 'did not find a new firmware or firmware is not set')

      this.setState({ modal: 'install' })
      const { success } = await installOsuFirmware
        .send({ devicePath: device.path, firmware: latestFirmware, targetId: deviceInfo.targetId })
        .toPromise()
      return success
    } catch (err) {
      logger.log(err)
      throw err
    }
  }

  installFinalFirmware = async (device: Device) => {
    try {
      const { success } = await installFinalFirmware.send({ devicePath: device.path }).toPromise()
      return success
    } catch (err) {
      logger.log(err)
      throw err
    }
  }

  flashMCU = async (device: Device) => {
    await installMcu.send({ devicePath: device.path }).toPromise()
  }

  handleCloseModal = () => this.setState({ modal: 'closed' })

  handleDisclaimerModal = () => this.setState({ modal: 'disclaimer' })
  handleInstallModal = () => this.setState({ modal: 'install' })

  render() {
    const { deviceInfo, t } = this.props
    const { latestFirmware, modal } = this.state
    return (
      <Card p={4}>
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
        {modal !== 'closed' ? <PreventDeviceChangeRecheck /> : null}
        {latestFirmware && (
          <Fragment>
            <DisclaimerModal
              firmware={latestFirmware}
              status={modal}
              goToNextStep={this.handleInstallModal}
              onClose={this.handleCloseModal}
            />
            <UpdateModal
              status={modal}
              onClose={this.handleCloseModal}
              firmware={latestFirmware}
              installOsuFirmware={this.installOsuFirmware}
              installFinalFirmware={this.installFinalFirmware}
              flashMCU={this.flashMCU}
            />
          </Fragment>
        )}
      </Card>
    )
  }
}

export default translate()(FirmwareUpdate)
