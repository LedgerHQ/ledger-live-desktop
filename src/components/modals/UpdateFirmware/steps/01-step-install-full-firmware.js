// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { timeout } from 'rxjs/operators/timeout'

import { DEVICE_INFOS_TIMEOUT } from 'config/constants'
import getDeviceInfo from 'commands/getDeviceInfo'

import { getCurrentDevice } from 'reducers/devices'
import { createCancelablePolling } from 'helpers/promise'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Progress from 'components/base/Progress'
import DeviceConfirm from 'components/DeviceConfirm'

import type { Device } from 'types/common'
import type { StepProps } from '../'

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
`

const Ellipsis = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
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
    const { installOsuFirmware, installFinalFirmware } = this.props
    const { device, deviceInfo } = await this.ensureDevice()
    if (deviceInfo.isOSU) {
      this.setState({ installing: true })
      const finalSuccess = await installFinalFirmware(device)
      if (finalSuccess) this.transitionTo()
    }

    const success = await installOsuFirmware(device)
    if (success) {
      this.setState({ installing: true })
      if (this._unsubConnect) this._unsubConnect()
      const { device: cleanDevice } = await this.ensureDevice()
      const finalSuccess = await installFinalFirmware(cleanDevice)
      if (finalSuccess) {
        this.transitionTo()
      }
    }
  }

  transitionTo = () => {
    const { firmware, transitionTo } = this.props
    if (firmware.shouldUpdateMcu) {
      transitionTo('updateMCU')
    } else {
      transitionTo('finish')
    }
  }

  renderBody = () => {
    const { installing } = this.state
    const { firmware, t } = this.props

    if (installing) {
      return (
        <Box mx={7}>
          <Progress infinite style={{ width: '100%' }} />
        </Box>
      )
    }

    return (
      <Fragment>
        <Box mx={7} mt={5}>
          <Text ff="Open Sans|SemiBold" align="center" color="smoke">
            {t('app:manager.modal.identifier')}
          </Text>
          <Address>
            <Ellipsis>{firmware && firmware.hash}</Ellipsis>
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
    const { t } = this.props
    return (
      <Container>
        <Title>{t('app:manager.modal.confirmIdentifier')}</Title>
        <Text ff="Open Sans|Regular" align="center" color="smoke">
          {t('app:manager.modal.confirmIdentifierText')}
        </Text>
        {this.renderBody()}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

export default connect(mapStateToProps)(StepFullFirmwareInstall)
