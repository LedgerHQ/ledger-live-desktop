// @flow

import React from 'react'
import { getDeviceModel } from '@ledgerhq/devices'
import Box from 'components/base/Box'
import TrackPage from 'analytics/TrackPage'

import GrowScroll from 'components/base/GrowScroll'

import OnboardingFooter from '../../OnboardingFooter'
import WriteSeedNano from './WriteSeedNano'
import WriteSeedBlue from './WriteSeedBlue'
import WriteSeedRestore from './WriteSeedRestore'
import { FixedTopContainer } from '../../helperComponents'
import type { StepProps } from '../..'

export default (props: StepProps) => {
  const { nextStep, prevStep, t, onboarding } = props

  const model = getDeviceModel(onboarding.deviceModelId || 'nanoS')

  return (
    <FixedTopContainer>
      <GrowScroll pb={7}>
        <TrackPage
          category="Onboarding"
          name="Recovery Phase"
          flowType={onboarding.flowType}
          deviceType={model.productName}
        />
        <Box grow alignItems="center">
          {onboarding.flowType === 'restoreDevice' ? (
            <WriteSeedRestore onboarding={onboarding} />
          ) : onboarding.deviceModelId === 'nanoS' ? (
            <WriteSeedNano />
          ) : (
            <WriteSeedBlue />
          )}
        </Box>
      </GrowScroll>
      <OnboardingFooter
        horizontal
        align="center"
        flow={2}
        t={t}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    </FixedTopContainer>
  )
}
