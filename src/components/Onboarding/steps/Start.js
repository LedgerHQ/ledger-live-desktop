// @flow

import React from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

import IconGetStarted from 'icons/onboarding/GetStartedLogo'
import type { StepProps } from '..'
import { Title, Description } from '../helperComponents'

export default (props: StepProps) => {
  const { jumpStep, t } = props
  return (
    <Box sticky alignItems="center" justifyContent="center">
      <Box align="center" alignItems="center">
        <IconGetStarted />
        <Box style={{ paddingTop: '20px' }}>
          <Title>{t('onboarding:start.title')}</Title>
          <Description>{t('onboarding:start.desc')}</Description>
        </Box>
        <Button padded primary onClick={() => jumpStep('init')}>
          Get Started
        </Button>
      </Box>
    </Box>
  )
}
