// @flow

import React from 'react'

import Box from 'components/base/Box'

import { Title } from '../../helperComponents'
import OnboardingFooter from '../../OnboardingFooter'
import SelectPINnano from './SelectPINnano'
import SelectPINblue from './SelectPINblue'

import type { StepProps } from '../..'

export default (props: StepProps) => {
  const { nextStep, prevStep, t, onboarding } = props

  return (
    <Box sticky pt={50}>
      <Box grow alignItems="center" justifyContent="center">
        <Title>{t('onboarding:selectPIN.title')}</Title>
        <Box align="center" mt={7}>
          {onboarding.isLedgerNano ? <SelectPINnano /> : <SelectPINblue />}
        </Box>
      </Box>
      <OnboardingFooter horizontal flow={2} t={t} nextStep={nextStep} prevStep={prevStep} />
    </Box>
  )
}
