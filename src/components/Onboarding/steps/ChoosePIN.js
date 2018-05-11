// @flow

import React from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import { Title, Description, OnboardingFooter } from '../helperComponents'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { nextStep, prevStep } = props
  return (
    <Box sticky alignItems="center" justifyContent="center">
      <Box align="center">
        <Title>This is CHOOSE PIN screen. 1 line is the maximum</Title>
        <Description>
          This is a long text, please replace it with the final wording once it’s done.
          <br />
          Lorem ipsum dolor amet ledger lorem dolor ipsum amet
        </Description>
      </Box>
      <OnboardingFooter horizontal align="center" justify="flex-end" flow={2}>
        <Button small outline onClick={() => prevStep()}>
          Go Back
        </Button>
        <Button small primary onClick={() => nextStep()}>
          Continue
        </Button>
      </OnboardingFooter>
    </Box>
  )
}
