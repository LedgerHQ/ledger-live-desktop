// @flow

import React from 'react'
import { i } from 'helpers/staticPath'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

import type { StepProps } from '..'
import { Title, LiveLogo } from '../helperComponents'

export default (props: StepProps) => {
  const { jumpStep, t } = props
  return (
    <Box sticky justifyContent="center">
      <Box alignItems="center">
        <LiveLogo
          style={{ width: 80, height: 80 }}
          icon={<img src={i('ledgerlive-logo.svg')} width={50} height={50} />}
        />
        <Box my={5}>
          <Title>{t('onboarding:start.title')}</Title>
        </Box>
        <Button padded primary onClick={() => jumpStep('init')}>
          {t('onboarding:start.startBtn')}
        </Button>
      </Box>
    </Box>
  )
}
