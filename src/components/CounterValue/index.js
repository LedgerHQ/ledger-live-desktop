// @flow

import type { BigNumber } from 'bignumber.js'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Currency } from '@ledgerhq/live-common/lib/types'

import {
  counterValueCurrencySelector,
  currencySettingsSelector,
  counterValueExchangeSelector,
  intermediaryCurrency,
} from 'reducers/settings'
import CounterValues from 'helpers/countervalues'

import FormattedVal from 'components/base/FormattedVal'

import type { State } from 'reducers'

type OwnProps = {
  // wich market to query
  currency: Currency,

  // when? if not given: take latest
  date?: Date,

  value: BigNumber,

  alwaysShowSign?: boolean,
}

type Props = OwnProps & {
  // from reducers
  counterValueCurrency: Currency,
  value: ?number,
}

const mapStateToProps = (state: State, props: OwnProps) => {
  const { currency, value, date } = props
  const counterValueCurrency = counterValueCurrencySelector(state)
  const fromExchange = currencySettingsSelector(state, { currency }).exchange
  const toExchange = counterValueExchangeSelector(state)
  const counterValue = CounterValues.calculateWithIntermediarySelector(state, {
    from: currency,
    fromExchange,
    intermediary: intermediaryCurrency,
    toExchange,
    to: counterValueCurrency,
    value,
    date,
  })

  return {
    counterValueCurrency,
    value: counterValue,
  }
}

class CounterValue extends PureComponent<Props> {
  static defaultProps = {
    alwaysShowSign: true, // FIXME this shouldn't be true by default
  }
  render() {
    const { value, counterValueCurrency, date, alwaysShowSign, ...props } = this.props
    if (!value) {
      return null
    }
    return (
      <FormattedVal
        val={value}
        unit={counterValueCurrency.units[0]}
        showCode
        alwaysShowSign={alwaysShowSign}
        {...props}
      />
    )
  }
}

export default connect(mapStateToProps)(CounterValue)
