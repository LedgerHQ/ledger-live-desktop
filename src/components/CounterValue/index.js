// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Currency } from '@ledgerhq/live-common/lib/types'

import { counterValueCurrencySelector } from 'reducers/settings'
import { calculateCounterValueSelector } from 'reducers/counterValues'

import FormattedVal from 'components/base/FormattedVal'

import type { State } from 'reducers'

type OwnProps = {
  // wich market to query
  // FIXME drop ticker in favor of currency
  ticker: string,
  currency?: Currency,

  // when? if not given: take latest
  date?: Date,

  value: number,
}

type Props = OwnProps & {
  // from reducers
  counterValueCurrency: Currency,
  value: number,
}

const mapStateToProps = (state: State, props: OwnProps) => {
  const { ticker, value, date } = props

  if (ticker) {
    // FIXME actually ticker should be deprecated, not currency!!
    console.warn('CounterValue: `currency` should be passed instead of `ticker`') // eslint-disable-line no-console
  }

  let { currency } = props
  if (!currency && ticker) {
    currency = generateFakeCurrency(ticker)
  }

  const counterValueCurrency = counterValueCurrencySelector(state)
  const counterValue =
    !counterValueCurrency || !currency
      ? 0
      : calculateCounterValueSelector(state)(currency, counterValueCurrency)(value, date)

  return {
    counterValueCurrency,
    value: counterValue,
  }
}

class CounterValue extends PureComponent<Props> {
  render() {
    const { value, counterValueCurrency, date, ...props } = this.props
    return (
      <FormattedVal
        val={value}
        fiat={counterValueCurrency.units[0].code}
        showCode
        alwaysShowSign
        {...props}
      />
    )
  }
}

function generateFakeCurrency(ticker) {
  return {
    ticker,
    units: [
      {
        code: ticker,

        // unused
        name: 'fake-unit',
        magnitude: 0,
      },
    ],

    // unused
    id: '',
    color: '#000',
    name: 'fake-coin',
    scheme: 'bitcoin',
  }
}

export default connect(mapStateToProps)(CounterValue)
