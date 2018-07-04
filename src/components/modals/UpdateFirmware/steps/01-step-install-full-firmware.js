// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { timeout } from 'rxjs/operators/timeout'

import { DEVICE_INFOS_TIMEOUT } from 'config/constants'
import getDeviceInfo from 'commands/getDeviceInfo'

import { getCurrentDevice } from 'reducers/devices'
import { createCancelablePolling, delay } from 'helpers/promise'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import DeviceConfirm from 'components/DeviceConfirm'

import type { Device } from 'types/common'
import type { StepProps } from '../'

import Installing from '../Installing'

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  color: 'dark',
  px: 7,
})``

const Title = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 5,
  mb: 3,
})``

const Address = styled(Box).attrs({
  bg: p => (p.notValid ? 'transparent' : p.withQRCode ? 'white' : 'lightGrey'),
  borderRadius: 1,
  color: 'dark',
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  mt: 2,
  px: p => (p.notValid ? 0 : 4),
  py: p => (p.notValid ? 0 : 3),
})`
  border: ${p => (p.notValid ? 'none' : `1px dashed ${p.theme.colors.fog}`)};
  cursor: text;
  user-select: text;
  width: 325px;
  text-align: center;
`

type Props = StepProps & {
  device: Device,
}

type State = {
  installing: boolean,
}

class StepFullFirmwareInstall extends PureComponent<Props, State> {
  state = {
    installing: false,
  }

  componentDidMount() {
    this.install()
  }

  componentWillUnmount() {
    if (this._unsubConnect) this._unsubConnect()
  }

  ensureDevice = () => {
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
    this._unsubConnect = unsubscribe
    return promise
  }

  install = async () => {
    const {
      installOsuFirmware,
      installFinalFirmware,
      firmware,
      shouldFlashMcu,
      transitionTo,
      setError,
    } = this.props
    const { device, deviceInfo } = await this.ensureDevice()

    if (deviceInfo.isBootloader) {
      transitionTo('updateMCU')
    }

    try {
      if (deviceInfo.isOSU) {
        this.setState({ installing: true })
        await installFinalFirmware(device)
        transitionTo('finish')
      } else {
        await installOsuFirmware(device)
        this.setState({ installing: true })
        if (this._unsubConnect) this._unsubConnect()
        if ((firmware && firmware.shouldFlashMcu) || shouldFlashMcu) {
          delay(1000)
          transitionTo('updateMCU')
        } else {
          const { device: freshDevice } = await this.ensureDevice()
          await installFinalFirmware(freshDevice)
          transitionTo('finish')
        }
      }
    } catch (error) {
      setError(error)
      transitionTo('finish')
    }
  }

  formatHashName = (hash: string): string[] => {
    if (!hash) {
      return []
    }

    const length = hash.length
    const half = Math.ceil(length / 2)
    const start = hash.slice(0, half)
    const end = hash.slice(half)
    return [start, end]
  }

  renderBody = () => {
    const { installing } = this.state
    const { t, firmware } = this.props

    return installing ? (
      <Installing />
    ) : (
      <Fragment>
        <Text ff="Open Sans|Regular" align="center" color="smoke">
          {t('app:manager.modal.confirmIdentifierText')}
        </Text>
        <Box mx={7} mt={5}>
          <Text ff="Open Sans|SemiBold" align="center" color="smoke">
            {t('app:manager.modal.identifier')}
          </Text>
          <Address>
            {firmware && firmware.hash && this.formatHashName(firmware.hash).join('\n')}
          </Address>
        </Box>
        <Box mt={5}>
          <DeviceConfirm />
        </Box>
      </Fragment>
    )
  }

  _unsubConnect: *

  render() {
    const { installing } = this.state
    const { t } = this.props
    return (
      <Container>
        <Title>{installing ? '' : t('app:manager.modal.confirmIdentifier')}</Title>
        <TrackPage category="Manager" name="InstallFirmware" />
        {this.renderBody()}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

export default connect(mapStateToProps)(StepFullFirmwareInstall)
