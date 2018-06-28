// @flow
/* eslint-disable react/jsx-no-literals */ // FIXME

import React, { PureComponent, Fragment } from 'react'
import { translate, Trans } from 'react-i18next'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import invariant from 'invariant'
import logger from 'logger'

import type { Device, T } from 'types/common'

import type { LedgerScriptParams } from 'helpers/common'

import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import installOsuFirmware from 'commands/installOsuFirmware'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import Tooltip from 'components/base/Tooltip'
import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'
import Modal, { ModalBody, ModalFooter, ModalTitle, ModalContent } from 'components/base/Modal'
import Button from 'components/base/Button'
// import Progress from 'components/base/Progress'

import NanoS from 'icons/device/NanoS'
import CheckFull from 'icons/CheckFull'

import { PreventDeviceChangeRecheck } from 'components/EnsureDevice'
import UpdateFirmwareButton from './UpdateFirmwareButton'

let CACHED_LATEST_FIRMWARE = null

export const getCleanVersion = (input: string): string =>
  input.endsWith('-osu') ? input.replace('-osu', '') : input

type ModalStatus = 'closed' | 'disclaimer' | 'installing' | 'error' | 'success'

type Props = {
  t: T,
  device: Device,
  deviceInfo: DeviceInfo,
}

type State = {
  latestFirmware: ?LedgerScriptParams,
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
    if (!CACHED_LATEST_FIRMWARE || isEmpty(this.state.latestFirmware)) {
      this.fetchLatestFirmware()
    }
  }

  componentWillUnmount() {
    this._unmounting = true
  }

  _unmounting = false

  fetchLatestFirmware = async () => {
    const { deviceInfo } = this.props
    const latestFirmware =
      CACHED_LATEST_FIRMWARE || (await getLatestFirmwareForDevice.send(deviceInfo).toPromise())
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
      const { deviceInfo } = this.props
      invariant(latestFirmware, 'did not find a new firmware or firmware is not set')
      const {
        device: { path: devicePath },
      } = this.props
      this.setState({ modal: 'installing' })
      const { success } = await installOsuFirmware
        .send({ devicePath, firmware: latestFirmware, targetId: deviceInfo.targetId })
        .toPromise()
      if (success) {
        this.fetchLatestFirmware()
      }
    } catch (err) {
      logger.log(err)
    }
  }

  handleCloseModal = () => this.setState({ modal: 'closed' })

  handleInstallModal = () => this.setState({ modal: 'disclaimer' })

  renderModal = () => {
    const { t } = this.props
    const { modal, latestFirmware } = this.state
    return (
      <Modal
        isOpened={modal !== 'closed'}
        render={() => (
          <ModalBody grow align="center" justify="center" mt={3}>
            <Fragment>
              <ModalTitle>{t('app:manager.firmware.update')}</ModalTitle>
              <ModalContent>
                <Text ff="Open Sans|Regular" fontSize={4} color="graphite" align="center">
                  <Trans i18nKey="app:manager.firmware.disclaimerTitle">
                    You are about to install the latest
                    <Text ff="Open Sans|SemiBold" color="dark">
                      {`firmware ${latestFirmware ? getCleanVersion(latestFirmware.name) : ''}`}
                    </Text>
                  </Trans>
                </Text>
                <Text ff="Open Sans|Regular" fontSize={4} color="graphite" align="center">
                  {t('app:manager.firmware.disclaimerAppDelete')}
                  {t('app:manager.firmware.disclaimerAppReinstall')}
                </Text>
              </ModalContent>
              <ModalFooter horizontal justifyContent="flex-end" style={{ width: '100%' }}>
                <Button primary padded onClick={this.installFirmware}>
                  {t('app:manager.firmware.continue')}
                </Button>
              </ModalFooter>
            </Fragment>
          </ModalBody>
        )}
      />
    )
  }

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
          <UpdateFirmwareButton
            firmware={latestFirmware}
            installFirmware={this.handleInstallModal}
          />
        </Box>
        {modal !== 'closed' ? <PreventDeviceChangeRecheck /> : null}
        {this.renderModal()}
      </Card>
    )
  }
}

export default translate()(FirmwareUpdate)
