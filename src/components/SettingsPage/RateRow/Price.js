// @flow
import React, { Component } from 'react'
import type { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { formatCurrencyUnit } from '@ledgerhq/live-common/lib/currencies'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import CounterValues from 'helpers/countervalues'

const mapStateToProps = createStructuredSelector({
  countervalue: CounterValues.calculateSelector,
})

class Price extends Component<{
  from: Currency,
  to: Currency,
  exchange: string, // eslint-disable-line
  value: BigNumber,
  countervalue: ?BigNumber,
  date?: Date, // eslint-disable-line
}> {
  render() {
    const { from, to, value, countervalue } = this.props
    if (!countervalue) return null
    return (
      <span>
        <strong>{formatCurrencyUnit(from.units[0], value, { showCode: true })}</strong>
        {' = '}
        <strong>{formatCurrencyUnit(to.units[0], countervalue, { showCode: true })}</strong>
      </span>
    )
  }
}

export default connect(mapStateToProps)(Price)
