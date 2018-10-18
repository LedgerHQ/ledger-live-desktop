// @flow

import React, { Fragment } from 'react'

import TrackPage from 'analytics/TrackPage'
import SelectCurrency from 'components/SelectCurrency'
import Button from 'components/base/Button'
import CurrencyBadge from 'components/base/CurrencyBadge'

import type { StepProps } from '../index'

function StepChooseCurrency({ currency, setCurrency }: StepProps) {
  return <SelectCurrency autoFocus onChange={setCurrency} value={currency} />
}

export function StepChooseCurrencyFooter({ transitionTo, currency, t }: StepProps) {
  return (
    <Fragment>
      <TrackPage category="AddAccounts" name="Step1" />
      {currency && <CurrencyBadge mr="auto" currency={currency} />}
      <Button primary disabled={!currency} onClick={() => transitionTo('connectDevice')}>
        {t('common.continue')}
      </Button>
    </Fragment>
  )
}

export default StepChooseCurrency
