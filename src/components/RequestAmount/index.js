// @flow

import { BigNumber } from 'bignumber.js'
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import type { Currency, Account } from '@ledgerhq/live-common/lib/types'

import {
  counterValueCurrencySelector,
  currencySettingsSelector,
  counterValueExchangeSelector,
  intermediaryCurrency,
} from 'reducers/settings'
import CounterValues from 'helpers/countervalues'

import InputCurrency from 'components/base/InputCurrency'
import Box from 'components/base/Box'
import type { State } from 'reducers'

const InputRight = styled(Box).attrs({
  ff: 'Rubik',
  color: 'graphite',
  fontSize: 4,
  justifyContent: 'center',
  pr: 3,
})``

const InputCenter = styled(Box).attrs({
  ff: 'Rubik',
  color: 'graphite',
  fontSize: 4,
  alignItems: 'center',
  justifyContent: 'center',
})`
  width: 30px;
`

type OwnProps = {
  // left value (always the one which is returned)
  value: BigNumber,

  validTransactionError?: ?Error,

  // change handler
  onChange: BigNumber => void,

  // used to determine the left input unit
  account: Account,
}

type Props = OwnProps & {
  // used to determine the right input unit
  // retrieved via selector (take the chosen countervalue unit)
  rightCurrency: Currency,

  // used to calculate the opposite field value (right & left)
  getCounterValue: BigNumber => ?BigNumber,
  getReverseCounterValue: BigNumber => ?BigNumber,
}

const mapStateToProps = (state: State, props: OwnProps) => {
  const {
    account: { currency },
  } = props
  const counterValueCurrency = counterValueCurrencySelector(state)
  const fromExchange = currencySettingsSelector(state, { currency }).exchange
  const toExchange = counterValueExchangeSelector(state)

  // FIXME this make the component not working with "Pure". is there a way we can calculate here whatever needs to be?
  // especially the value comes from props!
  const getCounterValue = value =>
    CounterValues.calculateWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary: intermediaryCurrency,
      toExchange,
      to: counterValueCurrency,
      value,
      disableRounding: true,
    })
  const getReverseCounterValue = value =>
    CounterValues.reverseWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary: intermediaryCurrency,
      toExchange,
      to: counterValueCurrency,
      value,
    })

  return {
    rightCurrency: counterValueCurrency,
    getCounterValue,
    getReverseCounterValue,
  }
}

export class RequestAmount extends PureComponent<Props> {
  static defaultProps = {
    validTransaction: true,
  }

  handleChangeAmount = (changedField: string) => (val: BigNumber) => {
    const { getReverseCounterValue, onChange } = this.props
    if (changedField === 'left') {
      onChange(val)
    } else if (changedField === 'right') {
      const leftVal = getReverseCounterValue(val) || BigNumber(0)
      onChange(leftVal)
    }
  }

  onLeftChange = this.handleChangeAmount('left')
  onRightChange = this.handleChangeAmount('right')

  render() {
    const { value, account, rightCurrency, getCounterValue, validTransactionError } = this.props
    const right = getCounterValue(value) || BigNumber(0)
    const rightUnit = rightCurrency.units[0]

    return (
      <Box horizontal>
        <InputCurrency
          error={validTransactionError}
          defaultUnit={account.unit}
          value={value}
          onChange={this.onLeftChange}
          renderRight={<InputRight>{account.unit.code}</InputRight>}
        />
        <InputCenter>{'='}</InputCenter>
        <InputCurrency
          defaultUnit={rightUnit}
          value={right}
          onChange={this.onRightChange}
          renderRight={<InputRight>{rightUnit.code}</InputRight>}
          showAllDigits
          subMagnitude={3}
        />
      </Box>
    )
  }
}

export default connect(mapStateToProps)(RequestAmount)
