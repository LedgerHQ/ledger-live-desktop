// @flow
import { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import type { Unit } from '@ledgerhq/live-common/lib/types'

import { formatCurrencyUnit } from '@ledgerhq/live-common/lib/currencies'
import { localeSelector } from 'reducers/settings'

class CurrencyUnitValue extends Component<{
  unit: Unit,
  value: BigNumber,
  locale: string,
  showCode: boolean,
  alwaysShowSign?: boolean,
  before: string,
  after: string,
}> {
  static defaultProps = {
    before: '',
    after: '',
  }

  render() {
    const { unit, value, before, after, ...rest } = this.props
    return (
      before +
      formatCurrencyUnit(unit, value, {
        ...rest,
      }) +
      after
    )
  }
}

export default connect(createStructuredSelector({ locale: localeSelector }))(CurrencyUnitValue)
