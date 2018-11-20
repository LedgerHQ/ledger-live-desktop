// @flow

import React from 'react'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import Button from 'components/base/Button'
import SelectAccount from 'components/SelectAccount'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'

import type { StepProps } from '../index'

export default function StepAccount({ t, account, onChangeAccount }: StepProps) {
  return (
    <Box flow={1}>
      <TrackPage category="Receive Flow" name="Step 1" />
      {account ? <CurrencyDownStatusAlert currency={account.currency} /> : null}

      <Label>{t('receive.steps.chooseAccount.label')}</Label>
      <SelectAccount autoFocus onChange={onChangeAccount} value={account} />
    </Box>
  )
}

export function StepAccountFooter({ t, transitionTo, account }: StepProps) {
  return (
    <Button disabled={!account} primary onClick={() => transitionTo('device')}>
      {t('common.continue')}
    </Button>
  )
}
