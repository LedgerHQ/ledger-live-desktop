// @flow

import React from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

import IconGetStarted from 'icons/illustrations/GetStartedLogo'
import type { StepProps } from '..'
import { Title } from '../helperComponents'

export default (props: StepProps) => {
  const { jumpStep, t } = props
  return (
    <Box sticky justifyContent="center">
      <Box alignItems="center">
        <IconGetStarted />
        <Box my={4}>
          <Title>{t('onboarding:start.title')}</Title>
        </Box>
        <Button padded primary onClick={() => jumpStep('init')}>
          Get Started
        </Button>
      </Box>
    </Box>
  )
}
