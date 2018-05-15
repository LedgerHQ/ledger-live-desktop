// @flow

import React from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

import IconGetStarted from 'icons/onboarding/GetStartedLogo'
import type { StepProps } from '..'
import { Title, Description } from '../helperComponents'

export default (props: StepProps) => {
  const { jumpStep } = props
  return (
    <Box sticky alignItems="center" justifyContent="center">
      <Box align="center" alignItems="center">
        <IconGetStarted />
        <Box style={{ paddingTop: '20px' }}>
          <Title>Welcome to the new Ledger Live Desktop app.</Title>
          <Description>Let’s get started!</Description>
        </Box>
        <Button primary onClick={() => jumpStep('init')}>
          Get Started
        </Button>
      </Box>
    </Box>
  )
}
