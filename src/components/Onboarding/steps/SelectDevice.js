// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { i } from 'helpers/staticPath'

import { rgba } from 'styles/helpers'

import { deviceType } from 'reducers/onboarding'
import type { DeviceType } from 'reducers/onboarding'

import Box from 'components/base/Box'
import TrackPage from 'analytics/TrackPage'

import IconCheckCirle from 'icons/Check'

import { Title, Inner, FixedTopContainer, StepContainerInner } from '../helperComponents'
import OnboardingFooter from '../OnboardingFooter'

import type { StepProps } from '..'

const mapDispatchToProps = { deviceType }

class SelectDevice extends PureComponent<StepProps, {}> {
  handleDeviceType = (deviceType: DeviceType) => {
    this.props.deviceType(deviceType)
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
                isActive={onboarding.deviceType === 'nanoS'}
                onClick={() => this.handleDeviceType('nanoS')}
              >
                {onboarding.deviceType === 'nanoS' && <DeviceSelected />}
                <DeviceIcon>
                  <img alt="" src={i('ledger-nano-onb.svg')} />
                </DeviceIcon>
                <BlockTitle>{t('onboarding.selectDevice.ledgerNanoCard.title')}</BlockTitle>
              </DeviceContainer>
              <DeviceContainer
                isActive={onboarding.deviceType === 'blue'}
                onClick={() => this.handleDeviceType('blue')}
              >
                {onboarding.deviceType === 'blue' && <DeviceSelected />}
                <DeviceIcon>
                  <img alt="" src={i('ledger-blue-onb.svg')} />
                </DeviceIcon>
                <BlockTitle>{t('onboarding.selectDevice.ledgerBlueCard.title')}</BlockTitle>
              </DeviceContainer>
            </Inner>
          </Box>
        </StepContainerInner>
        <OnboardingFooter
          horizontal
          t={t}
          nextStep={this.handleContinue}
          prevStep={() => jumpStep('init')}
          isContinueDisabled={onboarding.deviceType === ''}
        />
      </FixedTopContainer>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(SelectDevice)

const DeviceContainer = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  relative: true,
  borderRadius: '4px',
})`
  width: 218px;
  height: 204px;
  border: ${props => `1px solid ${props.theme.colors[props.isActive ? 'wallet' : 'fog']}`};
  &:hover {
    cursor: default; // this here needs reset because it inherits from cursor: text from parent
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`
const DeviceIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  width: 55px;
  height: 80px;
`

export const BlockTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  textAlign: 'center',
  pt: 3,
})``
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

const SelectDeviceIconWrapper = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  bg: 'wallet',
})`
  border-radius: 50%;
  width: 18px;
  height: 18px;
`
