// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { timeout } from 'rxjs/operators/timeout'

import { DEVICE_INFOS_TIMEOUT } from 'config/constants'
import { i } from 'helpers/staticPath'
import { getCurrentDevice } from 'reducers/devices'
import { createCancelablePolling } from 'helpers/promise'
import getDeviceInfo from 'commands/getDeviceInfo'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

import type { Device } from 'types/common'

import type { StepProps } from '../'

import Installing from '../Installing'

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  color: 'dark',
})``

const Title = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 5,
  mb: 3,
})``

const Bullet = styled.span`
  font-weight: 600;
  color: #142533;
`

const Separator = styled(Box).attrs({
  color: 'fog',
})`
  height: 1px;
  width: 100%;
  background-color: currentColor;
`

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

type Props = StepProps & { device?: Device }

type State = {
  installing: boolean,
}

class StepFlashMcu extends PureComponent<Props, State> {
  state = {
    installing: false,
  }

  componentDidMount() {
    this.install()
  }

  componentWillUnmount() {
    if (this._unsubConnect) this._unsubConnect()
    if (this._unsubDeviceInfo) this._unsubDeviceInfo()
  }

  getDeviceInfo = () => {
    const { unsubscribe, promise } = createCancelablePolling(async () => {
      const { device } = this.props
      if (!device) {
        throw new Error('No device')
      }
      const deviceInfo = await getDeviceInfo
        .send({ devicePath: device.path })
        .pipe(timeout(DEVICE_INFOS_TIMEOUT))
        .toPromise()

      return { device, deviceInfo }
    })
    this._unsubDeviceInfo = unsubscribe
    return promise
  }

  waitForDeviceInBootloader = () => {
    const { unsubscribe, promise } = createCancelablePolling(async () => {
      const { device } = this.props
      if (!device) {
        throw new Error('No device')
      }
      const deviceInfo = await getDeviceInfo
        .send({ devicePath: device.path })
        .pipe(timeout(DEVICE_INFOS_TIMEOUT))
        .toPromise()

      if (!deviceInfo.isBootloader) {
        throw new Error('Device is not in bootloader')
      }
      return { device, deviceInfo }
    })
    this._unsubConnect = unsubscribe
    return promise
  }

  flash = async () => {
    await this.waitForDeviceInBootloader()
    const { flashMCU, device } = this.props
    if (device) {
      this.setState({ installing: true })
      await flashMCU(device)
    }
  }

  install = async () => {
    const { transitionTo, installFinalFirmware, setError } = this.props
    const { deviceInfo, device } = await this.getDeviceInfo()

    try {
      if (deviceInfo.isBootloader) {
        await this.flash()
        this.install()
      } else if (deviceInfo.isOSU) {
        await installFinalFirmware(device)
        transitionTo('finish')
      } else {
        transitionTo('finish')
      }
    } catch (error) {
      setError(error)
      transitionTo('finish')
    }
  }

  firstFlash = async () => {
    await this.flash()
    this.install()
  }

  renderBody = () => {
    const { installing } = this.state
    const { t } = this.props

    return installing ? (
      <Installing />
    ) : (
      <Fragment>
        <Box mx={7}>
          <Text ff="Open Sans|Regular" align="center" color="smoke">
            <Bullet>{'1.'}</Bullet>
            {t('manager.modal.mcuFirst')}
          </Text>
          <img
            src={i('logos/unplugDevice.png')}
            style={{ width: '100%', maxWidth: 368, marginTop: 30 }}
            alt={t('manager.modal.mcuFirst')}
          />
        </Box>
        <Separator my={6} />
        <Box mx={7}>
          <Text ff="Open Sans|Regular" align="center" color="smoke">
            <Bullet>{'2.'}</Bullet>
            {t('manager.modal.mcuSecond')}
          </Text>
          <img
            src={i('logos/bootloaderMode.png')}
            style={{ width: '100%', maxWidth: 368, marginTop: 30 }}
            alt={t('manager.modal.mcuFirst')}
          />
        </Box>
      </Fragment>
    )
  }

  _unsubConnect: *
  _unsubDeviceInfo: *

  render() {
    const { t } = this.props
    const { installing } = this.state
    return (
      <Container>
        <Title>{installing ? '' : t('manager.modal.mcuTitle')}</Title>
        <TrackPage category="Manager" name="FlashMCU" />
        {this.renderBody()}
      </Container>
    )
  }
}

export default connect(mapStateToProps)(StepFlashMcu)
