// @flow

import React from 'react'
import { i } from 'helpers/staticPath'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import TrackPage from 'analytics/TrackPage'
import LedgerLiveLogo from 'components/base/LedgerLiveLogo'

import type { StepProps } from '..'
import { Title } from '../helperComponents'

export default (props: StepProps) => {
  const { jumpStep, t } = props
  return (
    <Box sticky justifyContent="center">
      <TrackPage category="Onboarding" name="Start" />
      <Box alignItems="center">
        <LedgerLiveLogo
          icon={<img src={i('ledgerlive-logo.svg')} alt="" width={50} height={50} />}
        />
        <Box my={5}>
          <Title>{t('onboarding.start.title')}</Title>
        </Box>
        <Button primary onClick={() => jumpStep('init')}>
          {t('onboarding.start.startBtn')}
        </Button>
      </Box>
    </Box>
  )
}
