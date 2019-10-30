// @flow

import { BigNumber } from 'bignumber.js'
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import type { Currency, Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import { getAccountCurrency, getAccountUnit } from '@ledgerhq/live-common/lib/account'
import {
  counterValueCurrencySelector,
  exchangeSettingsForPairSelector,
  intermediaryCurrency,
} from 'reducers/settings'
import CounterValues from 'helpers/countervalues'
import InputCurrency from 'components/base/InputCurrency'
import Box from 'components/base/Box'
import IconTransfer from 'icons/Transfer'
import type { State } from 'reducers'

const InputRight = styled(Box).attrs(() => ({
  ff: 'Inter|Medium',
  color: 'palette.text.shade60',
  fontSize: 4,
  justifyContent: 'center',
}))`
  padding-right: 10px;
`

const InputCenter = styled(Box).attrs(() => ({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'palette.text.shade40',
}))`
  margin-left: 19px;
  margin-right: 19px;
`

type OwnProps = {
  // left value (always the one which is returned)
  value: BigNumber,

  disabled?: boolean,

  validTransactionError: ?Error,

  // max left value
  max: BigNumber,

  // change handler
  onChange: BigNumber => void,

  // used to determine the left input unit
  account: Account | TokenAccount,
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
  const { account } = props
  const counterValueCurrency = counterValueCurrencySelector(state)
  const currency = getAccountCurrency(account)
  const intermediary = intermediaryCurrency(currency, counterValueCurrency)
  const fromExchange = exchangeSettingsForPairSelector(state, { from: currency, to: intermediary })
  const toExchange = exchangeSettingsForPairSelector(state, {
    from: intermediary,
    to: counterValueCurrency,
  })

  // FIXME this make the component not working with "Pure". is there a way we can calculate here whatever needs to be?
  // especially the value comes from props!
  const getCounterValue = value =>
    CounterValues.calculateWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary,
      toExchange,
      to: counterValueCurrency,
      value,
      disableRounding: true,
    })
  const getReverseCounterValue = value =>
    CounterValues.reverseWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary,
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
    max: BigNumber(Infinity),
    validTransaction: true,
  }

  handleClickMax = () => {
    const { max, onChange } = this.props
    if (isFinite(max)) {
      onChange(max)
    }
  }

  handleChangeAmount = (changedField: string) => (val: BigNumber) => {
    const { getReverseCounterValue, max, onChange } = this.props
    if (changedField === 'left') {
      onChange(val.gt(max) ? max : val)
    } else if (changedField === 'right') {
      const leftVal = getReverseCounterValue(val) || BigNumber(0)
      onChange(leftVal.gt(max) ? max : leftVal)
    }
  }

  onLeftChange = this.handleChangeAmount('left')
  onRightChange = this.handleChangeAmount('right')

  render() {
    const {
      disabled,
      value,
      account,
      rightCurrency,
      getCounterValue,
      validTransactionError,
    } = this.props
    const right = getCounterValue(value) || BigNumber(0)
    const rightUnit = rightCurrency.units[0]
    const defaultUnit = getAccountUnit(account)
    return (
      <Box horizontal flow={5} alignItems="center">
        <Box horizontal grow shrink>
          <InputCurrency
            disabled={disabled}
            error={validTransactionError}
            containerProps={{ grow: true }}
            defaultUnit={defaultUnit}
            value={value}
            onChange={this.onLeftChange}
            renderRight={<InputRight>{defaultUnit.code}</InputRight>}
          />
          <InputCenter>
            <IconTransfer />
          </InputCenter>
          <InputCurrency
            disabled={disabled}
            containerProps={{ grow: true }}
            defaultUnit={rightUnit}
            value={right}
            onChange={this.onRightChange}
            renderRight={<InputRight>{rightUnit.code}</InputRight>}
            showAllDigits
            subMagnitude={3}
          />
        </Box>
      </Box>
    )
  }
}

export default connect(mapStateToProps)(RequestAmount)
