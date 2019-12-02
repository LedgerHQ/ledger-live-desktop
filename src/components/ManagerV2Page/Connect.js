// @flow

import React, { PureComponent, Fragment } from 'react'
import { timeout } from 'rxjs/operators'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate, Trans } from 'react-i18next'
import { createCancelablePolling } from 'helpers/promise'

import logger from 'logger'
import type { T, Device } from 'types/common'
import manager from '@ledgerhq/live-common/lib/manager'
import type { DeviceInfo } from '@ledgerhq/live-common/lib/types/manager'

import { DEVICE_INFOS_TIMEOUT } from 'config/constants'

import { getCurrentDevice } from 'reducers/devices'
import { DeviceNotGenuineError, UnexpectedBootloader } from '@ledgerhq/errors'

import getDeviceInfo from 'commands/getDeviceInfo'
import listApps from 'commands/listApps'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import ConnectTroubleshooting from 'components/ConnectTroubleshooting'
import DeviceInteraction from 'components/DeviceInteraction'
import { ErrorDescContainer } from 'components/DeviceInteraction/components'
import AutoRepair from 'components/AutoRepair'
import Text from 'components/base/Text'

import IconUsb from 'icons/Usb'
import IconHome from 'icons/Home'
import IconCheck from 'icons/Check'

type Props = {
  t: T,
  onFail?: Error => void,
  onUnavailable?: Error => void,
  onSuccess: (*) => void,
  device: ?Device,
}

type State = {
  autoRepair: boolean,
  isBootloader: boolean,
  isRepairing: boolean,
}

const usbIcon = <IconUsb size={16} />
const homeIcon = <IconHome size={16} />
const genuineCheckIcon = <IconCheck size={16} />

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

const Bold = props => <Text ff="Inter|SemiBold" {...props} />

class Connect extends PureComponent<Props, State> {
  state = {
    isBootloader: false,
    autoRepair: false,
    isRepairing: false,
  }

  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe()
  }

  sub: *

  connectInteractionHandler = () =>
    createCancelablePolling(() => {
      const { device } = this.props
      if (!device) return Promise.reject()
      return Promise.resolve(device)
    })

  checkDashboardInteractionHandler = ({ device }: { device: Device }) =>
    createCancelablePolling(async () => {
      const deviceInfo = await getDeviceInfo
        .send({ devicePath: device.path })
        .pipe(timeout(DEVICE_INFOS_TIMEOUT))
        .toPromise()
      return deviceInfo
    })

  listAppsHandler = async ({ device, deviceInfo }: { device: Device, deviceInfo: DeviceInfo }) => {
    if (deviceInfo.isBootloader) {
      logger.log('device is in bootloader mode')
      this.setState({ isBootloader: true })
      throw new UnexpectedBootloader()
    }
    this.setState({ isBootloader: false })

    if (deviceInfo.isOSU) {
      logger.log('device is in update mode. skipping genuine')
      return null
    }

    // Preload things in parallel
    manager.getLatestFirmwareForDevice(deviceInfo).catch(e => {
      logger.warn(e)
    })

    const res = await new Promise((resolve, reject) => {
      this.sub = listApps.send({ devicePath: device.path, deviceInfo }).subscribe({
        next: e => {
          if (e.type === 'result') {
            resolve(e.result)
          }
          // we can use internal state to display the info
          // but we need a design solution on what we do
          /*
            else if (e.type === 'device-permission-requested') {
              setDevicePermissionRequested({ wording: e.wording })
            } else if (e.type === 'device-permission-granted') {
              setDevicePermissionRequested(null)
            }
            */
        },
        error: err => reject(err),
      })
    })

    return res
  }

  handleFail = (err: Error) => {
    const { onFail, onUnavailable } = this.props
    if (err instanceof DeviceNotGenuineError) {
      onFail && onFail(err)
    } else {
      onUnavailable && onUnavailable(err)
    }
  }

  onStartAutoRepair = () => this.setState({ autoRepair: true })

  onDoneAutoRepair = () => this.setState({ autoRepair: false })

  setRapairing = status => this.setState({ isRepairing: status })

  renderRepair() {
    const { onSuccess, device, ...props } = this.props
    const { isBootloader, isRepairing } = this.state

    const continueT = props.t('common.continue')

    if (!isRepairing && device) {
      if (!isBootloader) {
        return null
      }
      return (
        <Box
          fontSize={3}
          color="palette.text.shade100"
          align="center"
          cursor="text"
          ff="Inter|SemiBold"
        >
          <Box mt={4} mb={2}>
            <Trans
              i18nKey="genuinecheck.deviceInBootloader"
              values={{
                button: continueT,
              }}
            />
          </Box>
          <Button primary onClick={this.onStartAutoRepair} event="RepairBootloaderButton">
            {continueT}
          </Button>
        </Box>
      )
    }

    return <ConnectTroubleshooting onRepair={this.setRapairing} />
  }

  render() {
    const { onSuccess, device, ...props } = this.props
    const { autoRepair, isBootloader, isRepairing } = this.state
    const steps = [
      {
        id: 'device',
        title: (
          <Trans i18nKey="deviceConnect.step1" parent="div">
            {'Connect and unlock your'}
            <Bold>{'Ledger device'}</Bold>
          </Trans>
        ),
        icon: usbIcon,
        run: this.connectInteractionHandler,
      },
      {
        id: 'deviceInfo',
        title: (
          <Trans i18nKey="deviceConnect.dashboard" parent="div">
            {'Navigate to the'}
            <Bold>{'Dashboard'}</Bold>
            {'on your device'}
          </Trans>
        ),
        icon: homeIcon,
        run: this.checkDashboardInteractionHandler,
      },
      {
        id: 'listAppsRes',
        title: (
          <Trans i18nKey="deviceConnect.step3" parent="div">
            {'Allow'}
            <Bold>{'Ledger Manager'}</Bold>
            {'on your device'}
          </Trans>
        ),
        icon: genuineCheckIcon,
        run: this.listAppsHandler,
      },
    ]

    return (
      <Fragment>
        <DeviceInteraction
          disabled={isRepairing}
          key={device ? device.path : null}
          {...props}
          waitBeforeSuccess={500}
          steps={steps}
          onSuccess={onSuccess}
          onFail={this.handleFail}
          renderError={(error, retry) =>
            device && isBootloader ? null : (
              <ErrorDescContainer error={error} onRetry={retry} mt={4} />
            )
          }
        />
        {autoRepair ? <AutoRepair onDone={this.onDoneAutoRepair} /> : null}
        {this.renderRepair()}
      </Fragment>
    )
  }
}

export default compose(
  translate(),
  connect(mapStateToProps),
)(Connect)
