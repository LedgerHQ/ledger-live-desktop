// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getFiatUnit } from '@ledgerhq/currencies'

import { getCounterValueCode } from 'reducers/settings'
import { calculateCounterValueSelector } from 'reducers/counterValues'

import FormattedVal from 'components/base/FormattedVal'

type Props = {
  // wich market to query
  ticker: string,

  // the value :)
  value: number,

  // when? if not given: take latest
  date?: Date,

  // from reducers
  counterValueCode: string,
  getCounterValue: Function,
}

const mapStateToProps = (state, props) => {
  const { ticker } = props

  // TODO: in wallet-common, stop using currency.
  // always use ticker and remove that hack
  let { currency } = props
  if (!currency && ticker) {
    currency = generateFakeCurrency(ticker)
  } else if (currency) {
    console.warn('`currency` is deprecated in CounterValue. use `ticker` instead.') // eslint-disable-line no-console
  }

  const counterValueCode = getCounterValueCode(state)
  const counterValueUnit = getFiatUnit(counterValueCode)
  const getCounterValue = calculateCounterValueSelector(state)(currency, counterValueUnit)

  return {
    counterValueCode,
    getCounterValue,
  }
}

class CounterValue extends PureComponent<Props> {
  static defaultProps = {
    value: 0,
    date: undefined,
  }

  render() {
    const { getCounterValue, counterValueCode, date, value, ...props } = this.props
    const counterValue = getCounterValue(value, date)
    return (
      <FormattedVal val={counterValue} fiat={counterValueCode} showCode alwaysShowSign {...props} />
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
