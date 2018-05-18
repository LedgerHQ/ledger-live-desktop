// @flow

import React from 'react'

import Box from 'components/base/Box'

import IconSelectPIN from 'icons/onboarding/SelectPIN'
import {
  Title,
  Description,
  Inner,
  InstructionStep,
  IconInstructionStep,
} from '../helperComponents'
import OnboardingFooter from '../OnboardingFooter'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { nextStep, prevStep, t } = props
  const steps = [
    {
      key: 'step1',
      icon: <IconInstructionStep>1</IconInstructionStep>,
      desc: t('onboarding:selectPIN.instructions.step1'),
    },
    {
      key: 'step2',
      icon: <IconInstructionStep>2</IconInstructionStep>,
      desc: t('onboarding:selectPIN.instructions.step2'),
    },
    {
      key: 'step3',
      icon: <IconInstructionStep>3</IconInstructionStep>,
      desc: t('onboarding:selectPIN.instructions.step3'),
    },
    {
      key: 'step4',
      icon: <IconInstructionStep>4</IconInstructionStep>,
      desc: t('onboarding:selectPIN.instructions.step4'),
    },
  ]
  return (
    <Box sticky>
      <Box grow alignItems="center" justifyContent="center">
        <Box align="center" mb={5}>
          <Title>{t('onboarding:selectPIN.title')}</Title>
          <Description style={{ maxWidth: 714 }}>{t('onboarding:selectPIN.desc')}</Description>
        </Box>
        <Box>
          <Inner style={{ width: 760 }}>
            <Box style={{ width: 260 }} mt={5}>
              <IconSelectPIN />
            </Box>

            <Box shrink grow flow={5}>
              {steps.map(step => <InstructionStep key={step.key} step={step} />)}
            </Box>
          </Inner>
        </Box>
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
