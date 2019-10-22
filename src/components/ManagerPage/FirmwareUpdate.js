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

import NanoS from 'icons/device/NanoS'
import NanoX from 'icons/device/NanoX'
import Blue from 'icons/device/Blue'
import CheckFull from 'icons/CheckFull'

import UpdateFirmwareButton from './UpdateFirmwareButton'

export const getCleanVersion = (input: string): string =>
  input.endsWith('-osu') ? input.replace('-osu', '') : input

const Icon = ({ type }: { type: string }) => {
  switch (type) {
    case 'blue':
      return <Blue size={30} />
    case 'nanoX':
      return <NanoX size={30} />
    default:
      return <NanoS size={30} />
  }
}

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

const initialStepId = ({ deviceInfo, device }): StepId =>
  deviceInfo.isOSU
    ? 'updateMCU'
    : getDeviceModel(device.modelId).id === 'blue'
    ? 'resetDevice'
    : 'idCheck'

const intializeState = (props: Props): State => ({
  firmware: null,
  modal: 'closed',
  stepId: initialStepId(props),
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
          stepId: initialStepId(this.props),
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
          <Box color="palette.text.shade100">
            <Icon type={deviceSpecs.id} />
          </Box>
          <Box>
            <Box horizontal align="center">
              <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade100">
                {deviceSpecs.productName}
              </Text>
              <Box color="wallet" ml={2}>
                <Tooltip content={t('manager.yourDeviceIsGenuine')}>
                  <CheckFull size={13} color="palette.primary.main" />
                </Tooltip>
              </Box>
            </Box>
            <Text ff="Inter|SemiBold" fontSize={2}>
              {t('manager.firmware.installed', {
                version: deviceInfo.version,
              })}
            </Text>
          </Box>
          <UpdateFirmwareButton
            deviceInfo={deviceInfo}
            firmware={firmware}
            onClick={this.handleDisclaimerModal}
          />
        </Box>
        {ready ? (
          <>
            <DisclaimerModal
              firmware={firmware}
              deviceInfo={deviceInfo}
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
              deviceModelId={deviceSpecs.id}
            />
          </>
        ) : null}
      </Card>
    )
  }
}

export default translate()(FirmwareUpdate)
