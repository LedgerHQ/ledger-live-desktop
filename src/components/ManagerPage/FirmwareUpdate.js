// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { getDeviceModel } from '@ledgerhq/devices'
import type { DeviceInfo, FirmwareUpdateContext } from '@ledgerhq/live-common/lib/types/manager'

import type { Device, T } from 'types/common'
import type { StepId } from 'components/modals/UpdateFirmware'

import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import DisclaimerModal from 'components/modals/UpdateFirmware/Disclaimer'
import UpdateModal from 'components/modals/UpdateFirmware'

import Tooltip from 'components/base/Tooltip'
import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'
import DeviceIcon from 'components/DeviceIcon'
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
  firmware: ?FirmwareUpdateContext,
  modal: ModalStatus,
  stepId: ?StepId,
  ready: boolean,
  error: ?Error,
}

const intializeState = ({ deviceInfo }): State => ({
  firmware: null,
  modal: 'closed',
  stepId: deviceInfo.isBootloader ? 'updateMCU' : 'idCheck',
  ready: false,
  error: null,
})

class FirmwareUpdate extends PureComponent<Props, State> {
  state = intializeState(this.props)

  async componentDidMount() {
    const { deviceInfo } = this.props
    try {
      const firmware = await getLatestFirmwareForDevice.send(deviceInfo).toPromise()
      if (firmware && !this._unmounting) {
        /* eslint-disable */
        this.setState({
          firmware,
          ready: true,
          modal: deviceInfo.isOSU ? 'install' : 'closed',
          stepId: deviceInfo.isOSU ? 'updateMCU' : 'idCheck',
        })
        /* eslint-enable */
      }
    } catch (error) {
      /* eslint-disable */
      this.setState({
        ready: true,
        modal: deviceInfo.isOSU ? 'install' : 'closed',
        stepId: 'finish',
        error,
      })
      /* eslint-enable */
    }
  }

  componentWillUnmount() {
    this._unmounting = true
  }

  _unmounting = false

  handleCloseModal = () => this.setState({ modal: 'closed' })

  handleDisclaimerModal = () => this.setState({ modal: 'disclaimer' })

  handleDisclaimerNext = () => this.setState({ modal: 'install' })

  render() {
    const { deviceInfo, t, device } = this.props
    const { firmware, modal, stepId, ready, error } = this.state

    const deviceSpecs = getDeviceModel(device.modelId)

    return (
      <Card p={4}>
        <Box horizontal align="center" flow={2}>
          <Box color="dark">
            <DeviceIcon size={30} type={deviceSpecs.id} />
          </Box>
          <Box>
            <Box horizontal align="center">
              <Text ff="Open Sans|SemiBold" fontSize={4} color="dark">
                {deviceSpecs.productName}
              </Text>
              <Box color="wallet" ml={2}>
                <Tooltip render={() => t('manager.yourDeviceIsGenuine')}>
                  <CheckFull size={13} color="wallet" />
                </Tooltip>
              </Box>
            </Box>
            <Text ff="Open Sans|SemiBold" fontSize={2}>
              {t('manager.firmware.installed', {
                version: deviceInfo.version,
              })}
            </Text>
          </Box>
          <UpdateFirmwareButton firmware={firmware} onClick={this.handleDisclaimerModal} />
        </Box>
        {ready ? (
          <>
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
              error={error}
            />
          </>
        ) : null}
      </Card>
    )
  }
}

export default translate()(FirmwareUpdate)
