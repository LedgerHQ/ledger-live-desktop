// @flow

import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { getDeviceModel } from '@ledgerhq/devices'
import type { DeviceModelId } from '@ledgerhq/devices'

import { getCurrentDevice } from 'reducers/devices'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import { powerOff, powerOffDevice, bootOptions, recovery } from 'config/nontranslatables'
import type { StepProps } from '../'

const Container = styled(Box).attrs(() => ({
  alignItems: 'center',
  fontSize: 4,
  color: 'palette.text.shade100',
  px: 7,
}))``

const SubTitle = styled(Box).attrs(() => ({
  ff: 'Inter|Regular',
  fontSize: 4,
  mb: 3,
}))``

const Wrapper = styled(Box).attrs(() => ({
  my: 2,
}))`
  width: 100%;
`

const BulletText = styled(Text).attrs(() => ({
  ff: 'Inter|Regular',
  color: 'palette.text.shade80',
  fontSize: 2,
}))``

type Props = {
  deviceModelId: DeviceModelId,
}

const StepResetDevice = ({ deviceModelId }: Props) => {
  const device = getDeviceModel(deviceModelId)
  return (
    <Container>
      <TrackPage category="Manager" name="ResetBlueDevice" />

      <Wrapper>
        <SubTitle justifyContent="start">
          <Trans i18nKey="manager.modal.resetSteps.first" />
        </SubTitle>
        <BulletText ff="Inter|Regular" color="palette.text.shade80" fontSize={2}>
          <Trans
            i18nKey="manager.modal.resetSteps.connect"
            values={{ deviceName: device ? device.productName : '' }}
          />
        </BulletText>
        <BulletText ff="Inter|Regular" color="palette.text.shade80" fontSize={2}>
          <Trans i18nKey="manager.modal.resetSteps.turnOn" />
        </BulletText>
        <BulletText ff="Inter|Regular" color="palette.text.shade80" fontSize={2}>
          <Trans i18nKey="manager.modal.resetSteps.falsePin" />
        </BulletText>
        <BulletText ff="Inter|Regular" color="palette.text.shade80" fontSize={2}>
          <Trans i18nKey="manager.modal.resetSteps.turnOff" values={{ action: powerOffDevice }} />
        </BulletText>
        <BulletText ff="Inter|Regular" color="palette.text.shade80" fontSize={2}>
          <Trans i18nKey="manager.modal.resetSteps.confirmTurnOff" values={{ action: powerOff }} />
        </BulletText>
      </Wrapper>

      <Wrapper>
        <SubTitle justifyContent="start">
          <Trans i18nKey="manager.modal.resetSteps.second" values={{ mode: recovery }} />
        </SubTitle>
        <BulletText ff="Inter|Regular" color="palette.text.shade80" fontSize={2}>
          <Trans i18nKey="manager.modal.resetSteps.boot" values={{ option: bootOptions }} />
        </BulletText>
        <BulletText ff="Inter|Regular" color="palette.text.shade80" fontSize={2}>
          <Trans i18nKey="manager.modal.resetSteps.recoveryMode" values={{ mode: recovery }} />
        </BulletText>
      </Wrapper>

      <Wrapper>
        <SubTitle justifyContent="start">
          <Trans i18nKey="manager.modal.resetSteps.third" />
        </SubTitle>
        <BulletText ff="Inter|Regular" color="palette.text.shade80" fontSize={2}>
          <Trans i18nKey="manager.modal.resetSteps.openLive" />
        </BulletText>
        <BulletText ff="Inter|Regular" color="palette.text.shade80" fontSize={2}>
          <Trans
            i18nKey="manager.modal.resetSteps.uninstall"
            values={{ deviceName: device ? device.productName : '' }}
          />
        </BulletText>
        <Text ff="Inter|Regular" color="palette.text.shade80" fontSize={1}>
          <Trans i18nKey="manager.modal.resetSteps.disclaimer" />
        </Text>
      </Wrapper>
    </Container>
  )
}

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

export function StepResetFooter({ transitionTo, t }: StepProps) {
  return (
    <Button primary onClick={() => transitionTo('idCheck')}>
      {t('common.continue')}
    </Button>
  )
}

export default connect(mapStateToProps)(StepResetDevice)
