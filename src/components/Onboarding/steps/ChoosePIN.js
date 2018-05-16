// @flow

import React from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import styled from 'styled-components'

import IconSelectPIN from 'icons/onboarding/SelectPIN'
import { Title, Description, OnboardingFooter, Inner } from '../helperComponents'

import type { StepProps } from '..'

export const IconSelectStep = styled(Box).attrs({
  width: 26,
  height: 26,
  textAlign: 'center',
})`
  border-radius: 100%;
  background: #6490f126;
`

export default (props: StepProps) => {
  const { nextStep, prevStep, t } = props
  const steps = [
    {
      key: 'step1',
      icon: <IconSelectStep>1</IconSelectStep>,
      desc: t('onboarding:selectPIN.instructions.step1'),
    },
    {
      key: 'step2',
      icon: <IconSelectStep>2</IconSelectStep>,
      desc: t('onboarding:selectPIN.instructions.step2'),
    },
    {
      key: 'step3',
      icon: <IconSelectStep>3</IconSelectStep>,
      desc: t('onboarding:selectPIN.instructions.step3'),
    },
    {
      key: 'step4',
      icon: <IconSelectStep>4</IconSelectStep>,
      desc: t('onboarding:selectPIN.instructions.step4'),
    },
  ]
  return (
    <Box sticky>
      <Box grow alignItems="center" justifyContent="center">
        <Box align="center" mb={5}>
          <Title>{t('onboarding:selectPIN.title')}</Title>
          <Description>{t('onboarding:selectPIN.desc')}</Description>
        </Box>
        <Box>
          <Inner style={{ width: 760 }}>
            <Box style={{ width: 260 }} mt={5}>
              <IconSelectPIN />
            </Box>

            <Box shrink grow flow={5}>
              {steps.map(step => <SelectPINStep key={step.key} step={step} />)}
            </Box>
          </Inner>
        </Box>
      </Box>
      <OnboardingFooter horizontal align="center" flow={2}>
        <Button small outline onClick={() => prevStep()}>
          Go Back
        </Button>
        <Button small primary onClick={() => nextStep()} ml="auto">
          Continue
        </Button>
      </OnboardingFooter>
    </Box>
  )
}

type StepType = {
  icon: any,
  desc: string,
}
export function SelectPINStep({ step }: { step: StepType }) {
  const { icon, desc } = step
  return (
    <Box horizontal>
      <Box justify="center" color="grey" style={{ width: 26 }}>
        {icon}
      </Box>
      <Box ff="Open Sans|Regular" justify="center" fontSize={4} style={{ paddingLeft: 10 }} shrink>
        <CardDescription>{desc}</CardDescription>
      </Box>
    </Box>
  )
}

export const CardDescription = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'left',
  color: 'smoke',
  shrink: 1,
})``
