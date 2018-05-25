// @flow

import React from 'react'

import SelectCurrency from 'components/SelectCurrency'
import Button from 'components/base/Button'

import type { StepProps } from '../index'

function StepChooseCurrency({ currency, setState }: StepProps) {
  return <SelectCurrency onChange={currency => setState({ currency })} value={currency} />
}

export function StepChooseCurrencyFooter({ transitionTo, currency, t }: StepProps) {
  return (
    <Button primary disabled={!currency} onClick={() => transitionTo('connectDevice')}>
      {t('common:next')}
    </Button>
  )
}

export default StepChooseCurrency
