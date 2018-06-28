// @flow

import React from 'react'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import IconCheckCircle from 'icons/CheckCircle'

import type { StepProps } from '../index'

function StepFinish({ onCloseModal, onGoStep1, t }: StepProps) {
  return (
    <Box align="center" py={6}>
      <TrackPage category="AddAccounts" name="Step4" />
      <Box color="positiveGreen">
        <IconCheckCircle size={40} />
      </Box>
      <Box p={4}>{t('app:addAccounts.success')}</Box>
      <Box horizontal>
        <Button mr={2} outline onClick={onGoStep1}>
          {t('app:addAccounts.cta.addMore')}
        </Button>
        <Button primary onClick={onCloseModal}>
          {t('app:common.close')}
        </Button>
      </Box>
    </Box>
  )
}

export default StepFinish
