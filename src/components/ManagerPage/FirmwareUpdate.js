// @flow
/* eslint-disable react/jsx-no-literals */ // FIXME

import React, { PureComponent, Fragment } from 'react'
import { translate } from 'react-i18next'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import type { Device, T } from 'types/common'

import type {
  DeviceInfo,
  OsuFirmware,
  FinalFirmware,
} from '@ledgerhq/live-common/lib/types/manager'
import type { StepId } from 'components/modals/UpdateFirmware'

import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import DisclaimerModal from 'components/modals/UpdateFirmware/Disclaimer'
import UpdateModal from 'components/modals/UpdateFirmware'

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
  firmware: ?{ osu: OsuFirmware, final: FinalFirmware },
  modal: ModalStatus,
  stepId: ?StepId,
  shouldFlash: boolean,
  ready: boolean,
}

const intializeState = ({ deviceInfo }): State => ({
  firmware: null,
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
    } else {
      this.handleInstallModal('updateMCU', true)
    }
  }

  componentWillUnmount() {
    this._unmounting = true
  }

  _unmounting = false

  fetchLatestFirmware = async () => {
    const { deviceInfo } = this.props
    const firmware = await getLatestFirmwareForDevice.send(deviceInfo).toPromise()
    if (!isEmpty(firmware) && !isEqual(this.state.firmware, firmware) && !this._unmounting) {
      this.setState({ firmware, ready: true })
    }
  }

  handleCloseModal = () => this.setState({ modal: 'closed' })

  handleDisclaimerModal = () => this.setState({ modal: 'disclaimer' })

  handleInstallModal = (stepId: StepId = 'idCheck', shouldFlash?: boolean) =>
    this.setState({ modal: 'install', stepId, shouldFlash, ready: true })

  handleDisclaimerNext = () => this.setState({ modal: 'install' })

  render() {
    const { deviceInfo, t, device } = this.props
    const { firmware, modal, stepId, shouldFlash, ready } = this.state
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
                  ? t('manager.firmware.titleBlue')
                  : t('manager.firmware.titleNano')}
              </Text>
              <Box color="wallet" ml={2}>
                <Tooltip render={() => t('manager.yourDeviceIsGenuine')}>
                  <CheckFull size={13} color="wallet" />
                </Tooltip>
              </Box>
            </Box>
            <Text ff="Open Sans|SemiBold" fontSize={2}>
              {t('manager.firmware.installed', {
                version: deviceInfo.fullVersion,
              })}
            </Text>
          </Box>
          <UpdateFirmwareButton firmware={firmware} onClick={this.handleDisclaimerModal} />
        </Box>
        {ready ? (
          <Fragment>
            <DisclaimerModal
              firmware={firmware}
              status={modal}
              goToNextStep={this.handleDisclaimerNext}
              onClose={this.handleCloseModal}
            />
            <UpdateModal
              status={modal}
              stepId={stepId}
              onClose={this.handleCloseModal}
              firmware={firmware}
              shouldFlashMcu={shouldFlash}
            />
          </Fragment>
        ) : null}
      </Card>
    )
  }
}

export default translate()(FirmwareUpdate)
