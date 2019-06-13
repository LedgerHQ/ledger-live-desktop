// @flow

import React, { Fragment } from 'react'
import { getMainAccount } from '@ledgerhq/live-common/lib/account'
import TrackPage from 'analytics/TrackPage'
import Button from 'components/base/Button'
import EnsureDeviceApp from 'components/EnsureDeviceApp'

import type { StepProps } from '../index'

export default function StepConnectDevice({
  account,
  parentAccount,
  onChangeAppOpened,
}: StepProps<*>) {
  return (
    <Fragment>
      <TrackPage category="Send Flow" name="Step 2" />
      <EnsureDeviceApp
        account={account ? getMainAccount(account, parentAccount) : null}
        waitBeforeSuccess={200}
        onSuccess={() => onChangeAppOpened(true)}
      />
    </Fragment>
  )
}

export function StepConnectDeviceFooter({ t, transitionTo, isAppOpened }: StepProps<*>) {
  return (
    <Button disabled={!isAppOpened} primary onClick={() => transitionTo('verification')}>
      {t('common.continue')}
    </Button>
  )
}
