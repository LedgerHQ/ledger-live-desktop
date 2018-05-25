// @flow

import React from 'react'

import Button from 'components/base/Button'
import ConnectDevice from 'components/modals/StepConnectDevice'

import type { StepProps } from '../index'

function StepConnectDevice({ t, currency, currentDevice, setState }: StepProps) {
  return (
    <ConnectDevice
      t={t}
      deviceSelected={currentDevice}
      currency={currency}
      onStatusChange={s => {
        if (s === 'connected') {
          setState({ isAppOpened: true })
        }
      }}
    />
  )
}

export function StepConnectDeviceFooter({ t, transitionTo, isAppOpened }: StepProps) {
  return (
    <Button primary disabled={!isAppOpened} onClick={() => transitionTo('import')}>
      {t('common:next')}
    </Button>
  )
}

export default StepConnectDevice
