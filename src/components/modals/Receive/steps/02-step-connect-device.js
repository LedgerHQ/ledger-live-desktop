// @flow

import React, { Fragment } from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import EnsureDeviceApp from 'components/EnsureDeviceApp'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import TrackPage from 'analytics/TrackPage'

import type { StepProps } from '../index'

export default function StepConnectDevice({ account, onChangeAppOpened }: StepProps) {
  return (
    <Fragment>
      {account ? <CurrencyDownStatusAlert currency={account.currency} /> : null}
      <EnsureDeviceApp
        account={account}
        waitBeforeSuccess={200}
        onSuccess={() => onChangeAppOpened(true)}
      />
    </Fragment>
  )
}

export function StepConnectDeviceFooter({
  t,
  transitionTo,
  isAppOpened,
  onSkipConfirm,
}: StepProps) {
  return (
    <Box horizontal flow={2}>
      <TrackPage category="Receive Flow" name="Step 2" />
      <Button
        event="Receive Flow Without Device Clicked"
        onClick={() => {
          onSkipConfirm()
          transitionTo('receive')
        }}
      >
        {t('receive.steps.connectDevice.withoutDevice')}
      </Button>
      <Button disabled={!isAppOpened} primary onClick={() => transitionTo('confirm')}>
        {t('common.continue')}
      </Button>
    </Box>
  )
}
