// @flow

import invariant from 'invariant'
import React, { Fragment } from 'react'
import { Trans } from 'react-i18next'

import Button from 'components/base/Button'
import Box from 'components/base/Box'
import ConnectDevice from 'components/modals/StepConnectDevice'
import { CurrencyCircleIcon } from 'components/base/CurrencyBadge'

import type { StepProps } from '../index'

function StepConnectDevice({ t, currency, device, setAppOpened }: StepProps) {
  invariant(currency, 'No crypto asset given')

  return (
    <Fragment>
      <Box align="center" mb={6}>
        <CurrencyCircleIcon mb={3} size={40} currency={currency} />
        <Box ff="Open Sans" fontSize={4} color="dark" textAlign="center" style={{ width: 370 }}>
          <Trans i18nKey="app:addAccounts.connectDevice.desc" parent="div">
            {`Follow the steps below to add `}
            <strong style={{ fontWeight: 'bold' }}>{`${currency.name} (${
              currency.ticker
            })`}</strong>
            {` accounts from your Ledger device.`}
          </Trans>
        </Box>
      </Box>
      <ConnectDevice
        t={t}
        deviceSelected={device}
        currency={currency}
        onStatusChange={(deviceStatus, appStatus) => {
          if (appStatus === 'success') {
            setAppOpened(true)
          }
        }}
      />
    </Fragment>
  )
}

export function StepConnectDeviceFooter({ t, transitionTo, isAppOpened }: StepProps) {
  return (
    <Button primary disabled={!isAppOpened} onClick={() => transitionTo('import')}>
      {t('app:common.next')}
    </Button>
  )
}

export default StepConnectDevice
