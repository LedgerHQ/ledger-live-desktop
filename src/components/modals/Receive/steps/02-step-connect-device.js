// @flow

import React, { Fragment } from 'react'
import { Trans } from 'react-i18next'
import { getMainAccount } from '@ledgerhq/live-common/lib/account/helpers'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import EnsureDeviceApp from 'components/EnsureDeviceApp'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import TrackPage from 'analytics/TrackPage'

import type { StepProps } from '../index'

export default function StepConnectDevice({
  account,
  parentAccount,
  onChangeAppOpened,
}: StepProps) {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null
  return (
    <Fragment>
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      <EnsureDeviceApp
        account={mainAccount}
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
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  )
}
