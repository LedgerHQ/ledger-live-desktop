// @flow

import invariant from 'invariant'
import React, { Fragment } from 'react'
import { Trans } from 'react-i18next'
import TrackPage from 'analytics/TrackPage'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import { CurrencyCircleIcon } from 'components/base/CurrencyBadge'
import ConnectDevice from 'components/modals/StepConnectDevice'

import type { StepProps } from '../index'

const StepConnectDevice = ({ t, currency, device, setAppOpened }: StepProps) => {
  invariant(currency, 'No crypto asset given')

  const currencyName = `${currency.name} (${currency.ticker})`
  return (
    <Fragment>
      <TrackPage category="MigrateAccounts" name="Step2" />
      <Box align="center" mb={6}>
        <CurrencyCircleIcon borderRadius="10px" mb={15} size={40} currency={currency} />
        <Box
          ff="Inter|Regular"
          fontSize={6}
          color="palette.text.shade100"
          textAlign="center"
          style={{ width: 370 }}
        >
          <Trans
            i18nKey="migrateAccounts.connectDevice.title"
            parent="div"
            values={{ currencyName }}
          />
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

export const StepConnectDeviceFooter = ({ t, transitionTo, isAppOpened }: StepProps) => (
  <Button primary disabled={!isAppOpened} onClick={() => transitionTo('currency')}>
    {t('common.continue')}
  </Button>
)

export default StepConnectDevice
