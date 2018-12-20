// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import firmwarePrepare from 'commands/firmwarePrepare'
import { getCurrentDevice } from 'reducers/devices'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import ProgressBar from 'components/ProgressBar'
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
  text-align: center;
`

type Props = StepProps & {
  device: Device,
}

class StepFullFirmwareInstall extends PureComponent<Props, { progress: number }> {
  state = {
    progress: 0,
  }

  componentDidMount() {
    const { firmware, device, transitionTo, setError } = this.props

    if (!firmware.osu) {
      transitionTo('finish')
      return
    }

    this.sub = firmwarePrepare
      .send({
        devicePath: device.path,
        firmware,
      })
      .subscribe({
        next: patch => {
          this.setState(patch)
        },
        complete: () => {
          transitionTo('updateMCU')
        },
        error: error => {
          setError(error)
          transitionTo('finish')
        },
      })
  }

  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe()
  }

  sub: *

  formatHashName = (hash: string): string => {
    if (!hash) {
      return ''
    }

    hash = hash.toUpperCase()
    return hash.length > 8 ? `${hash.slice(0, 4)}...${hash.substr(-4)}` : hash
  }

  renderBody = () => {
    const { t, firmware } = this.props
    return (
      <Fragment>
        <Text ff="Open Sans|Regular" align="center" color="smoke">
          {t('manager.modal.confirmIdentifierText')}
        </Text>
        <Box mx={7} my={5}>
          <Text ff="Open Sans|SemiBold" align="center" color="smoke">
            {t('manager.modal.identifier')}
          </Text>
          <Address>{firmware.osu && this.formatHashName(firmware.osu.hash)}</Address>
        </Box>
        <ProgressBar progress={this.state.progress} width={200} />
        <Box mt={5}>
          <DeviceConfirm />
        </Box>
      </Fragment>
    )
  }

  render() {
    const { t } = this.props
    return (
      <Container>
        <Title>{t('manager.modal.confirmIdentifier')}</Title>
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
