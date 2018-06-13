// @flow

import React, { Fragment } from 'react'
import isArray from 'lodash/isArray'

import SelectCurrency from 'components/SelectCurrency'
import Button from 'components/base/Button'
import CurrencyBadge from 'components/base/CurrencyBadge'

import type { StepProps } from '../index'

function StepChooseCurrency({ currency, setState }: StepProps) {
  return (
    <SelectCurrency
      autoFocus
      onChange={currency => {
        setState({
          currency: isArray(currency) && currency.length === 0 ? null : currency,
        })
      }}
      value={currency}
    />
  )
}

export function StepChooseCurrencyFooter({ transitionTo, currency, t }: StepProps) {
  return (
    <Fragment>
      {currency && <CurrencyBadge mr="auto" currency={currency} />}
      <Button primary disabled={!currency} onClick={() => transitionTo('connectDevice')}>
        {t('app:common.next')}
      </Button>
    </Fragment>
  )
}

export default StepChooseCurrency
