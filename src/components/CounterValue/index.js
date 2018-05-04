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
  currency: Currency,
  exchange: string,

  // when? if not given: take latest
  date?: Date,

  value: number,
}

type Props = OwnProps & {
  // from reducers
  counterValueCurrency: Currency,
  value: ?number,
}

const mapStateToProps = (state: State, props: OwnProps) => {
  const { currency, value, date, exchange } = props
  const counterValueCurrency = counterValueCurrencySelector(state)
  const counterValue = calculateCounterValueSelector(state)(
    currency,
    counterValueCurrency,
    exchange,
  )(value, date)
  return {
    counterValueCurrency,
    value: counterValue,
  }
}

class CounterValue extends PureComponent<Props> {
  render() {
    const { value, counterValueCurrency, date, ...props } = this.props
    if (!value && value !== 0) return null
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

export default connect(mapStateToProps)(CounterValue)
