// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import isNaN from 'lodash/isNaN'

import type { Unit } from '@ledgerhq/currencies'

import { getCounterValue } from 'reducers/settings'

import FormattedVal from 'components/base/FormattedVal'

const mapStateToProps = state => ({
  counterValue: getCounterValue(state),
  counterValues: state.counterValues,
})

type Props = {
  formatValue: boolean,
  counterValue: string,
  counterValues: Object,
  time?: Date | string | number,
  unit: Unit,
  value: number,
}

export class CounterValue extends PureComponent<Props> {
  static defaultProps = {
    formatValue: true,
    value: 0,
    time: undefined,
  }

  render() {
    const { formatValue, value, unit, counterValue, counterValues, time, ...props } = this.props

    const cValues = counterValues[`${unit.code}-${counterValue}`]

    const v = isNaN(Number(value))
      ? 0
      : (time ? cValues.byDate[moment(time).format('YYYY-MM-DD')] : cValues.list[0][1]) *
        (value / 10 ** unit.magnitude)

    return formatValue ? (
      <FormattedVal val={v} fiat={counterValue} showCode alwaysShowSign {...props} />
    ) : (
      v
    )
  }
}

export default connect(mapStateToProps)(CounterValue)
