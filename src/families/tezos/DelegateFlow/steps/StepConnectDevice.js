// @flow

import React, { Fragment } from 'react'
import { getMainAccount } from '@ledgerhq/live-common/lib/account'
import TrackPage from 'analytics/TrackPage'
import Button from 'components/base/Button'
import EnsureDeviceApp from 'components/EnsureDeviceApp'
import TokenTips from 'components/modals/TokenTips'

import type { StepProps } from '../types'

export default function StepConnectDevice({
  account,
  parentAccount,
  onChangeAppOpened,
}: StepProps) {
  const token = account && account.type === 'TokenAccount' && account.token
  return (
    <Fragment>
      <TrackPage category="Send Flow" name="Step ConnectDevice" />
      <EnsureDeviceApp
        account={account ? getMainAccount(account, parentAccount) : null}
        isToken={!!token}
        waitBeforeSuccess={200}
        onSuccess={() => onChangeAppOpened(true)}
      />
      {!token ? null : <TokenTips token={token} />}
    </Fragment>
  )
}

export function StepConnectDeviceFooter({ t, transitionTo, isAppOpened }: StepProps) {
  return (
    <Button disabled={!isAppOpened} primary onClick={() => transitionTo('verification')}>
      {t('common.continue')}
    </Button>
  )
}
