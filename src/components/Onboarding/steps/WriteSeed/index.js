// @flow

import React from 'react'

import Box from 'components/base/Box'

import OnboardingFooter from '../../OnboardingFooter'

import WriteSeedNano from './WriteSeedNano'
import WriteSeedBlue from './WriteSeedBlue'
import WriteSeedRestore from './WriteSeedRestore'

import type { StepProps } from '../..'

export default (props: StepProps) => {
  const { nextStep, prevStep, t, onboarding } = props

  return (
    <Box sticky pt={50}>
      <Box grow alignItems="center" justifyContent="center">
        {onboarding.flowType === 'restoreDevice' ? (
          <WriteSeedRestore />
        ) : onboarding.isLedgerNano ? (
          <WriteSeedNano />
        ) : (
          <WriteSeedBlue />
        )}
      </Box>
      <OnboardingFooter
        horizontal
        align="center"
        flow={2}
        t={t}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    </Box>
  )
}
