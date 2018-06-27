// @flow

import React from 'react'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import IconCheckCircle from 'icons/CheckCircle'

import type { StepProps } from '../index'

function StepFinish({ onCloseModal, t }: StepProps) {
  return (
    <Box align="center" py={6}>
      <TrackPage category="AddAccounts" name="Step4" />
      <Box color="positiveGreen" mb={4}>
        <IconCheckCircle size={40} />
      </Box>
      <Box mb={4}>{t('app:addAccounts.success')}</Box>
      <Button primary onClick={onCloseModal}>
        {t('app:common.close')}
      </Button>
    </Box>
  )
}

export default StepFinish
