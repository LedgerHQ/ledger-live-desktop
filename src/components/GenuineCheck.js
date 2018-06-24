// @flow

import React, { PureComponent } from 'react'
import { timeout } from 'rxjs/operators/timeout'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate, Trans } from 'react-i18next'

import type { T, Device } from 'types/common'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import { GENUINE_TIMEOUT, DEVICE_INFOS_TIMEOUT } from 'config/constants'

import { createCancelablePolling } from 'helpers/promise'
import { getCurrentDevice } from 'reducers/devices'
import { createCustomErrorClass } from 'helpers/errors'

import getDeviceInfo from 'commands/getDeviceInfo'
import getIsGenuine from 'commands/getIsGenuine'

import DeviceInteraction from 'components/DeviceInteraction'
import Text from 'components/base/Text'

import IconUsb from 'icons/Usb'
import IconHome from 'icons/Home'
import IconEye from 'icons/Eye'

const DeviceNotGenuineError = createCustomErrorClass('DeviceNotGenuine')

type Props = {
  t: T,
  onSuccess: void => void,
  onFail: Error => void,
  onUnavailable: Error => void,
  device: ?Device,
}

const usbIcon = <IconUsb size={36} />
const homeIcon = <IconHome size={24} />
const eyeIcon = <IconEye size={24} />

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

const Bold = props => <Text ff="Open Sans|Bold" {...props} />

class GenuineCheck extends PureComponent<Props> {
  connectInteractionHandler = () =>
    createCancelablePolling(() => {
      const { device } = this.props
      if (!device) return Promise.reject()
      return Promise.resolve(device)
    })

  checkDashboardInteractionHandler = ({ device }: { device: Device }) =>
    createCancelablePolling(() =>
      getDeviceInfo
        .send({ devicePath: device.path })
        .pipe(timeout(DEVICE_INFOS_TIMEOUT))
        .toPromise(),
    )

  checkGenuineInteractionHandler = async ({
    device,
    infos,
  }: {
    device: Device,
    infos: DeviceInfo,
  }) => {
    const res = await getIsGenuine
      .send({
        devicePath: device.path,
        deviceInfo: infos,
      })
      .pipe(timeout(GENUINE_TIMEOUT))
      .toPromise()
    const isGenuine = res === '0000'
    if (!isGenuine) {
      return Promise.reject(new Error('Device not genuine')) // TODO: use custom error class
    }
    return Promise.resolve(true)
  }

  handleFail = (err: Error) => {
    const { onFail, onUnavailable } = this.props
    if (err instanceof DeviceNotGenuineError) {
      onFail(err)
    } else {
      onUnavailable(err)
    }
  }

  render() {
    const { onSuccess } = this.props
    const steps = [
      {
        id: 'device',
        title: (
          <Trans i18nKey="app:deviceConnect.step1.connect" parent="div">
            {'Connect and unlock your '}
            <Bold>{'Ledger device'}</Bold>
          </Trans>
        ),
        icon: usbIcon,
        run: this.connectInteractionHandler,
      },
      {
        id: 'infos',
        title: (
          <Trans i18nKey="deviceConnect:dashboard.open" parent="div">
            {'Navigate to the '}
            <Bold>{'dashboard'}</Bold>
            {' on your device'}
          </Trans>
        ),
        icon: homeIcon,
        run: this.checkDashboardInteractionHandler,
      },
      {
        id: 'isGenuine',
        title: (
          <Trans i18nKey="deviceConnect:stepGenuine.open" parent="div">
            {'Allow the '}
            <Bold>{'Ledger Manager'}</Bold>
            {' on your device'}
          </Trans>
        ),
        icon: eyeIcon,
        run: this.checkGenuineInteractionHandler,
      },
    ]

    return (
      <DeviceInteraction
        waitBeforeSuccess={500}
        steps={steps}
        onSuccess={onSuccess}
        onFail={this.handleFail}
      />
    )
  }
}

export default compose(
  translate(),
  connect(mapStateToProps),
)(GenuineCheck)
