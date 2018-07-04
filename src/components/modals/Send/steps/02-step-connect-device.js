// @flow

import React, { Fragment } from 'react'

import TrackPage from 'analytics/TrackPage'
import Button from 'components/base/Button'
import EnsureDeviceApp from 'components/EnsureDeviceApp'

import type { StepProps } from '../index'

export default function StepConnectDevice({ account, onChangeAppOpened }: StepProps<*>) {
  return (
    <Fragment>
      <TrackPage category="Send Flow" name="Step 2" />
      <EnsureDeviceApp
        account={account}
        waitBeforeSuccess={200}
        onSuccess={() => onChangeAppOpened(true)}
      />
    </Fragment>
  )
}

export function StepConnectDeviceFooter({ t, transitionTo, isAppOpened }: StepProps<*>) {
  return (
    <Button disabled={!isAppOpened} primary onClick={() => transitionTo('verification')}>
      {t('app:common.continue')}
    </Button>
  )
}
