// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import { connect } from 'react-redux'
import type { Account, CalculateCounterValue } from '@ledgerhq/wallet-common/lib/types'
import type { FiatUnit } from '@ledgerhq/currencies'

import type { T } from 'types/common'

import { getCounterValueFiatUnit } from 'reducers/settings'
import { calculateCounterValueSelector, reverseCounterValueSelector } from 'reducers/counterValues'

import InputCurrency from 'components/base/InputCurrency'
import Button from 'components/base/Button'
import Box from 'components/base/Box'

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

const mapStateToProps = state => ({
  rightUnit: getCounterValueFiatUnit(state),
  getCounterValue: calculateCounterValueSelector(state),
  getReverseCounterValue: reverseCounterValueSelector(state),
})

type Props = {
  // translation
  t: T,

  // left value (always the one which is returned)
  value: number,

  // max left value
  max: number,

  // change handler
  onChange: number => void,

  // used to determine the left input unit
  account: Account,

  // used to determine the right input unit
  // retrieved via selector (take the chosen countervalue unit)
  rightUnit: FiatUnit,

  // used to calculate the opposite field value (right & left)
  getCounterValue: CalculateCounterValue,
  getReverseCounterValue: CalculateCounterValue,
}

export class RequestAmount extends PureComponent<Props> {
  handleClickMax = () => {
    this.props.onChange(this.props.max)
  }

  handleChangeAmount = (changedField: string) => (val: number) => {
    const { rightUnit, getReverseCounterValue, account, max, onChange } = this.props
    if (changedField === 'left') {
      onChange(val > max ? max : val)
    } else if (changedField === 'right') {
      const leftVal = getReverseCounterValue(account.currency, rightUnit)(val)
      onChange(leftVal > max ? max : leftVal)
    }
  }

  render() {
    const { t, value, account, rightUnit, getCounterValue } = this.props
    const right = getCounterValue(account.currency, rightUnit)(value)

    return (
      <Box horizontal flow="5">
        <Box horizontal align="center">
          <InputCurrency
            containerProps={{ style: { width: 156 } }}
            unit={account.unit}
            value={value}
            onChange={this.handleChangeAmount('left')}
            renderRight={<InputRight>{account.unit.code}</InputRight>}
          />
          <InputCenter>=</InputCenter>
          <InputCurrency
            containerProps={{ style: { width: 156 } }}
            unit={rightUnit}
            value={right}
            onChange={this.handleChangeAmount('right')}
            renderRight={<InputRight>{rightUnit.code}</InputRight>}
            showAllDigits
          />
        </Box>
        <Box grow justify="flex-end">
          <Button primary onClick={this.handleClickMax}>
            {t('common:max')}
          </Button>
        </Box>
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps), translate())(RequestAmount)
