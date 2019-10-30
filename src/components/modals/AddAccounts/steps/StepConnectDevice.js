// @flow

import invariant from 'invariant'
import React, { Fragment } from 'react'
import { Trans } from 'react-i18next'

import TrackPage from 'analytics/TrackPage'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import ParentCryptoCurrencyIcon from 'components/ParentCryptoCurrencyIcon'
import ConnectDevice from 'components/modals/StepConnectDevice'
import { CurrencyCircleIcon } from 'components/base/CurrencyBadge'

import type { StepProps } from '../index'

function StepConnectDevice({ t, currency, device, setAppOpened }: StepProps) {
  invariant(currency, 'No crypto asset given')

  const currencyName = `${currency.name} (${currency.ticker})`

  return (
    <Fragment>
      <TrackPage category="AddAccounts" name="Step2" />
      <Box align="center" mb={6}>
        {currency.type === 'TokenCurrency' ? (
          <ParentCryptoCurrencyIcon currency={currency} bigger />
        ) : (
          <CurrencyCircleIcon size={40} currency={currency} />
        )}
        <Box
          mt={3}
          ff="Inter"
          fontSize={4}
          color="palette.text.shade100"
          textAlign="center"
          style={{ width: 370 }}
        >
          <Trans i18nKey="addAccounts.connectDevice.desc" parent="div">
            {`Follow the steps below to add `}
            <strong style={{ fontWeight: 'bold' }}>{currencyName}</strong>
            {` accounts from your Ledger device.`}
          </Trans>
        </Box>
      </Box>
      <ConnectDevice
        t={t}
        deviceSelected={device}
        currency={currency.type === 'TokenCurrency' ? currency.parentCurrency : currency}
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
      {t('common.continue')}
    </Button>
  )
}

export default StepConnectDevice
