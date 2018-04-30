// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

import { counterValueCurrencySelector } from 'reducers/settings'
import { calculateCounterValueSelector } from 'reducers/counterValues'

import FormattedVal from 'components/base/FormattedVal'

type Props = {
  // wich market to query
  ticker: string,

  // when? if not given: take latest
  date?: Date,

  // from reducers
  counterValueCurrency: CryptoCurrency,
  value: number,
}

const mapStateToProps = (state, props) => {
  const { ticker, value, date } = props

  // TODO: in wallet-common, stop using currency.
  // always use ticker and remove that hack
  let { currency } = props
  if (!currency && ticker) {
    currency = generateFakeCurrency(ticker)
  } else if (currency) {
    console.warn('`currency` is deprecated in CounterValue. use `ticker` instead.') // eslint-disable-line no-console
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
  static defaultProps = {
    value: 0,
    date: undefined,
  }

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
    coinType: 0,
    color: '#000',
    name: 'fake-coin',
    scheme: 'bitcoin',
  }
}

export default connect(mapStateToProps)(CounterValue)
