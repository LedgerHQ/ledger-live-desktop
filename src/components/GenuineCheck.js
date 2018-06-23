// @flow

import React, { PureComponent } from 'react'
import { timeout } from 'rxjs/operators/timeout'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'

import type { T, Device } from 'types/common'

import { GENUINE_TIMEOUT, DEVICE_INFOS_TIMEOUT } from 'config/constants'

import { createCancelablePolling } from 'helpers/promise'
import { getCurrentDevice } from 'reducers/devices'

import getDeviceInfo from 'commands/getDeviceInfo'
import getIsGenuine from 'commands/getIsGenuine'

import DeviceInteraction from 'components/DeviceInteraction'
import IconUsb from 'icons/Usb'

type Props = {
  t: T,
  onSuccess: void => void,
  onFail: Error => void,
  device: ?Device,
}

const usbIcon = <IconUsb size={36} />

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

class GenuineCheck extends PureComponent<Props> {
  connectInteractionHandler = () =>
    createCancelablePolling(500, () => {
      const { device } = this.props
      if (!device) return Promise.reject()
      return Promise.resolve(device)
    })

  checkDashboardInteractionHandler = ({ device }: { device: Device }) =>
    createCancelablePolling(500, () =>
      getDeviceInfo
        .send({ devicePath: device.path })
        .pipe(timeout(DEVICE_INFOS_TIMEOUT))
        .toPromise(),
    )

  checkGenuineInteractionHandler = async ({ device, infos }: { device: Device }) => {
    const res = await getIsGenuine
      .send({ devicePath: device.path, targetId: infos.targetId, version: infos.version })
      .pipe(timeout(GENUINE_TIMEOUT))
      .toPromise()
    const isGenuine = res === '0000'
    if (!isGenuine) {
      return Promise.reject(new Error('Device not genuine')) // TODO: use custom error class
    }
    return Promise.resolve(true)
  }

  render() {
    const { onSuccess, onFail } = this.props
    const steps = [
      {
        id: 'device',
        title: 'Connect your device',
        icon: usbIcon,
        desc: 'Because it is required',
        run: this.connectInteractionHandler,
      },
      {
        id: 'infos',
        title: 'Open the dashboard',
        desc: 'Quit any application',
        icon: null,
        run: this.checkDashboardInteractionHandler,
      },
      {
        id: 'isGenuine',
        title: 'Checking if genuine',
        desc: 'If asked, please confirm on your device',
        icon: null,
        run: this.checkGenuineInteractionHandler,
      },
    ]

    return (
      <DeviceInteraction
        waitBeforeSuccess={500}
        steps={steps}
        onSuccess={onSuccess}
        onFail={onFail}
      />
    )
  }
}

export default compose(
  translate(),
  connect(mapStateToProps),
)(GenuineCheck)
