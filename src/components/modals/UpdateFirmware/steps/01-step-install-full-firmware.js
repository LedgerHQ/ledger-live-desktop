// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import type { DeviceModelId } from '@ledgerhq/devices'

import firmwarePrepare from 'commands/firmwarePrepare'
import { getCurrentDevice } from 'reducers/devices'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import ProgressCircle from 'components/ProgressCircle'
import Interactions from 'icons/device/interactions'

import type { Device } from 'types/common'
import type { StepProps } from '../'

const Container = styled(Box).attrs(() => ({
  alignItems: 'center',
  fontSize: 4,
  color: 'palette.text.shade100',
  px: 7,
}))``

const Title = styled(Box).attrs(() => ({
  ff: 'Inter|Regular',
  fontSize: 5,
  mb: 3,
}))``

const Address = styled(Box).attrs(p => ({
  bg: p.notValid
    ? 'transparent'
    : p.withQRCode
    ? 'palette.background.paper'
    : 'palette.background.default',
  borderRadius: 1,
  color: 'palette.text.shade100',
  ff: 'Inter|SemiBold',
  fontSize: 4,
  mt: 2,
  px: p.notValid ? 0 : 4,
  py: p.notValid ? 0 : 3,
}))`
  border: ${p => (p.notValid ? 'none' : `1px dashed ${p.theme.colors.palette.divider}`)};
  cursor: text;
  user-select: text;
  width: 325px;
  text-align: center;
`

type Props = StepProps & {
  device: Device,
  deviceModelId: DeviceModelId,
}

type State = {
  progress: number,
  displayedOnDevice: boolean,
}

class StepFullFirmwareInstall extends PureComponent<Props, State> {
  state = {
    progress: 0,
    displayedOnDevice: false,
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
    const { t, firmware, deviceModelId } = this.props
    const { progress, displayedOnDevice } = this.state

    const isBlue = deviceModelId === 'blue'

    if (!displayedOnDevice) {
      return (
        <>
          <Text ff="Inter|Regular" align="center" color="palette.text.shade80">
            {t('manager.firmware.downloadingUpdateDesc')}
          </Text>
          <Box my={5}>
            <ProgressCircle progress={progress} size={56} />
          </Box>
        </>
      )
    }

    return (
      <>
        <Text ff="Inter|Regular" align="center" color="palette.text.shade80">
          {t('manager.modal.confirmIdentifierText')}
        </Text>
        <Box mx={7} mt={5} mb={isBlue ? 0 : 5}>
          <Text ff="Inter|SemiBold" align="center" color="palette.text.shade80">
            {t('manager.modal.identifier')}
          </Text>
          <Address>{firmware.osu && this.formatHashName(firmware.osu.hash)}</Address>
        </Box>
        <Box mt={isBlue ? 4 : null}>
          <Interactions
            wire="wired"
            type={deviceModelId}
            width={isBlue ? 150 : 375}
            screen="validation"
            action="accept"
          />
        </Box>
      </>
    )
  }

  render() {
    const { t } = this.props
    const { displayedOnDevice } = this.state
    return (
      <Container>
        <Title>
          {!displayedOnDevice
            ? t('manager.modal.steps.downloadingUpdate')
            : t('manager.modal.confirmIdentifier')}
        </Title>
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
