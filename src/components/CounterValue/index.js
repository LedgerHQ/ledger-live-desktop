// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { getFiatUnit } from '@ledgerhq/currencies'
import type { Unit, Currency } from '@ledgerhq/currencies'

import { getCounterValueCode } from 'reducers/settings'
import { calculateCounterValueSelector } from 'reducers/counterValues'

import FormattedVal from 'components/base/FormattedVal'

const mapStateToProps = state => ({
  counterValueCode: getCounterValueCode(state),
  getCounterValue: calculateCounterValueSelector(state),
})

type Props = {
  formatValue: boolean,
  counterValueCode: string,
  getCounterValue: Function,
  time?: Date | string | number,
  unit: Unit,
  currency: Currency,
  value: number,
}

export class CounterValue extends PureComponent<Props> {
  static defaultProps = {
    formatValue: true,
    value: 0,
    time: undefined,
  }

  render() {
    const {
      formatValue,
      value,
      currency,
      unit,
      counterValueCode,
      time,
      getCounterValue,
      ...props
    } = this.props
    const date = new Date(moment(time).format('YYYY-MM-DD'))
    const v = getCounterValue(currency, getFiatUnit(counterValueCode))(value, date)
    return formatValue ? (
      <FormattedVal val={v} fiat={counterValueCode} showCode alwaysShowSign {...props} />
    ) : (
      v
    )
  }
}

export default connect(mapStateToProps)(CounterValue)
