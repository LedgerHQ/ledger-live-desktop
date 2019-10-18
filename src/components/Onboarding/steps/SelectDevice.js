// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { getDeviceModel } from '@ledgerhq/devices'
import type { DeviceModelId } from '@ledgerhq/devices'

import { i } from 'helpers/staticPath'

import { rgba } from 'styles/helpers'

import { deviceModelId } from 'reducers/onboarding'

import InvertableImg from 'components/InvertableImg'
import Box from 'components/base/Box'
import TrackPage from 'analytics/TrackPage'

import IconCheckCirle from 'icons/Check'

import type { StepProps } from '..'
import { Title, Inner, FixedTopContainer, StepContainerInner } from '../helperComponents'
import OnboardingFooter from '../OnboardingFooter'
import Tooltip from '../../base/Tooltip'

const mapDispatchToProps = { deviceModelId }

class SelectDevice extends PureComponent<StepProps, {}> {
  handleDeviceModelId = (deviceModelId: DeviceModelId) => {
    this.props.deviceModelId(deviceModelId)
  }

  handleContinue = () => {
    const { nextStep, jumpStep, onboarding } = this.props
    if (onboarding.flowType === 'initializedDevice') {
      jumpStep('genuineCheck')
    } else {
      nextStep()
    }
  }
  render() {
    const { t, onboarding, jumpStep } = this.props
    return (
      <FixedTopContainer>
        <TrackPage category="Onboarding" name="Select Device" flowType={onboarding.flowType} />
        <StepContainerInner>
          <Box mb={5}>
            <Title>{t('onboarding.selectDevice.title')}</Title>
          </Box>
          <Box pt={4}>
            <Inner>
              <DeviceContainer
                isActive={onboarding.deviceModelId === 'nanoX'}
                onClick={() => this.handleDeviceModelId('nanoX')}
              >
                {onboarding.deviceModelId === 'nanoX' && <DeviceSelected />}
                <DeviceIcon>
                  <InvertableImg alt="" src={i('ledger-nano-x-onb.svg')} />
                </DeviceIcon>
                <BlockTitle>{getDeviceModel('nanoX').productName}</BlockTitle>
                <Tooltip content={<Trans i18nKey="onboarding.selectDevice.usbOnlyTooltip" />}>
                  <USBOnly>
                    <Trans i18nKey="onboarding.selectDevice.usbOnly" />
                  </USBOnly>
                </Tooltip>
              </DeviceContainer>
              <DeviceContainer
                isActive={onboarding.deviceModelId === 'nanoS'}
                onClick={() => this.handleDeviceModelId('nanoS')}
              >
                {onboarding.deviceModelId === 'nanoS' && <DeviceSelected />}
                <DeviceIcon>
                  <InvertableImg alt="" src={i('ledger-nano-s-onb.svg')} />
                </DeviceIcon>
                <BlockTitle>{getDeviceModel('nanoS').productName}</BlockTitle>
              </DeviceContainer>
              <DeviceContainer
                isActive={onboarding.deviceModelId === 'blue'}
                onClick={() => this.handleDeviceModelId('blue')}
              >
                {onboarding.deviceModelId === 'blue' && <DeviceSelected />}
                <DeviceIcon>
                  <InvertableImg alt="" src={i('ledger-blue-onb.svg')} />
                </DeviceIcon>
                <BlockTitle>{getDeviceModel('blue').productName}</BlockTitle>
              </DeviceContainer>
            </Inner>
          </Box>
        </StepContainerInner>
        <OnboardingFooter
          horizontal
          t={t}
          nextStep={this.handleContinue}
          prevStep={() => jumpStep('init')}
          isContinueDisabled={!onboarding.deviceModelId}
        />
      </FixedTopContainer>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(SelectDevice)

const DeviceContainer = styled(Box).attrs(() => ({
  alignItems: 'center',
  justifyContent: 'center',
  relative: true,
  borderRadius: '4px',
}))`
  width: 218px;
  height: 204px;
  border: ${p =>
    `1px solid ${
      p.isActive ? p.theme.colors.palette.primary.main : p.theme.colors.palette.divider
    }`};
  &:hover {
    cursor: default; // this here needs reset because it inherits from cursor: text from parent
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`
const DeviceIcon = styled(Box).attrs(() => ({
  alignItems: 'center',
  justifyContent: 'center',
}))`
  width: 55px;
  height: 80px;
`

export const BlockTitle = styled(Box).attrs(() => ({
  ff: 'Inter|SemiBold',
  fontSize: 4,
  textAlign: 'center',
  pt: 3,
  color: 'palette.text.shade100',
}))``
export function DeviceSelected() {
  return (
    <SelectDeviceIconWrapper
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
      }}
    >
      <IconCheckCirle size={10} />
    </SelectDeviceIconWrapper>
  )
}

const SelectDeviceIconWrapper = styled(Box).attrs(() => ({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'palette.background.paper',
  bg: 'wallet',
}))`
  border-radius: 50%;
  width: 18px;
  height: 18px;
`

const USBOnly = styled(Box).attrs(() => ({
  alignItems: 'center',
  justifyContent: 'center',
  ff: 'Inter|Bold',
  fontSize: 0,
  borderRadius: '2px',
}))`
  position: absolute;
  bottom: 20px;
  color: ${p => p.theme.colors.palette.primary.contrastText};
  background-color: ${p => p.theme.colors.palette.text.shade40};
  line-height: 16px;
  padding: 0 4px;
  text-transform: uppercase;
  transform: translateX(-50%);
`
