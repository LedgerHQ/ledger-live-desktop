// @flow

import React from 'react'

import Box from 'components/base/Box'
import TrackPage from 'analytics/TrackPage'

import { cleanDeviceName } from 'helpers/devices'
import GrowScroll from 'components/base/GrowScroll'
import { Title, FixedTopContainer } from '../../helperComponents'
import OnboardingFooter from '../../OnboardingFooter'
import SelectPINnano from './SelectPINnano'
import SelectPINblue from './SelectPINblue'
import SelectPINrestoreNano from './SelectPINrestoreNano'
import SelectPINrestoreBlue from './SelectPINrestoreBlue'

import type { StepProps } from '../..'

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
              {onboarding.deviceType === 'nanoS' ? (
                <SelectPINrestoreNano />
              ) : (
                <SelectPINrestoreBlue />
              )}
            </Box>
          </Box>
        ) : (
          <Box grow alignItems="center">
            <Title>{t('onboarding.selectPIN.initialize.title')}</Title>
            <Box align="center" mt={7}>
              {onboarding.deviceType === 'nanoS' ? <SelectPINnano /> : <SelectPINblue />}
            </Box>
          </Box>
        )}
      </GrowScroll>
      <OnboardingFooter horizontal flow={2} t={t} nextStep={nextStep} prevStep={prevStep} />
    </FixedTopContainer>
  )
}
