// @flow

import React from 'react'
import { i } from 'helpers/staticPath'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

import type { StepProps } from '..'
import { Title } from '../helperComponents'

export default (props: StepProps) => {
  const { jumpStep, t } = props
  return (
    <Box sticky justifyContent="center">
      <Box alignItems="center">
        <img alt="" src={i('get-started-onb.svg')} />
        <Box my={4}>
          <Title>{t('onboarding:start.title')}</Title>
        </Box>
        <Button padded primary onClick={() => jumpStep('init')}>
          {t('onboarding:start.startBtn')}
        </Button>
      </Box>
    </Box>
  )
}
