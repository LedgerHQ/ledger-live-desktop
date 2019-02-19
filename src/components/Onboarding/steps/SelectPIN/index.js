// @flow

import React from 'react'

import Box from 'components/base/Box'
import TrackPage from 'analytics/TrackPage'
import type { DeviceType } from 'reducers/onboarding'

import { cleanDeviceName } from 'helpers/devices'
import GrowScroll from 'components/base/GrowScroll'
import { Title, FixedTopContainer } from '../../helperComponents'
import OnboardingFooter from '../../OnboardingFooter'
import SelectPINnano from './SelectPINnano'
import SelectPINblue from './SelectPINblue'
import SelectPINnanoX from './SelectPINnanoX'
import SelectPINrestoreNano from './SelectPINrestoreNano'
import SelectPINrestoreBlue from './SelectPINrestoreBlue'
import type { StepProps } from '../..'

const SelectPinSwitcher = ({
  deviceType,
  restore = false,
}: {
  deviceType: DeviceType,
  restore?: boolean,
}) => {
  switch (deviceType) {
    case 'nanoX':
      return restore ? <SelectPINnanoX /> : <SelectPINnanoX /> // TODO: Restore NanoX
    case 'blue':
      return restore ? <SelectPINrestoreBlue /> : <SelectPINblue />
    default:
      return restore ? <SelectPINrestoreNano /> : <SelectPINnano />
  }
}

export default (props: StepProps) => {
  const { nextStep, prevStep, t, onboarding } = props

  return (
    <FixedTopContainer>
      <GrowScroll pb={7}>
        <TrackPage
          category="Onboarding"
          name="Choose PIN"
          flowType={onboarding.flowType}
          deviceType={cleanDeviceName(onboarding.deviceType)}
        />
        {onboarding.flowType === 'restoreDevice' ? (
          <Box grow alignItems="center">
            <Title>{t('onboarding.selectPIN.restore.title')}</Title>
            <Box align="center" mt={7}>
              <SelectPinSwitcher deviceType={onboarding.deviceType} restore />
            </Box>
          </Box>
        ) : (
          <Box grow alignItems="center">
            <Title>{t('onboarding.selectPIN.initialize.title')}</Title>
            <Box align="center" mt={7}>
              <SelectPinSwitcher deviceType={onboarding.deviceType} />
            </Box>
          </Box>
        )}
      </GrowScroll>
      <OnboardingFooter horizontal flow={2} t={t} nextStep={nextStep} prevStep={prevStep} />
    </FixedTopContainer>
  )
}
