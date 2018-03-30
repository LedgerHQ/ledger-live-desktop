// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import { connect } from 'react-redux'
import type { Account, CalculateCounterValue } from '@ledgerhq/wallet-common/lib/types'
import type { Unit } from '@ledgerhq/currencies'

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
  onChange: ({ left: number, right: number }) => void,

  // used to determine the left input unit
  account: Account,

  // used to determine the right input unit
  // retrieved via selector (take the chosen countervalue unit)
  rightUnit: Unit,

  // used to calculate the opposite field value (right & left)
  getCounterValue: CalculateCounterValue,
  getReverseCounterValue: CalculateCounterValue,
}

type State = {
  leftUnit: Unit,
  rightUnit: Unit,
  leftValue: number,
  rightValue: number,
}

export class RequestAmount extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    const { account, rightUnit, value, getCounterValue } = this.props

    const rawLeftValue = value * 10 ** account.unit.magnitude
    const rawRightValue = getCounterValue(account.currency, rightUnit)(rawLeftValue)
    const rightValue = rawRightValue / 10 ** rightUnit.magnitude

    this.state = {
      leftUnit: account.unit,
      rightUnit,
      leftValue: value,
      rightValue,
    }
  }

  handleClickMax = () => {
    const leftValue = this.props.max / 10 ** this.props.account.unit.magnitude
    this.handleChangeAmount('left')(leftValue)
    this.setState({ leftValue })
  }

  handleChangeAmount = (changedField: string) => (val: number) => {
    const { getCounterValue, getReverseCounterValue, account, max, onChange } = this.props
    const { rightUnit } = this.state
    if (changedField === 'left') {
      let rawLeftValue = val * 10 ** account.unit.magnitude
      if (rawLeftValue > max) {
        rawLeftValue = max
      }
      const leftValue = rawLeftValue / 10 ** account.unit.magnitude
      const rawRightValue = getCounterValue(account.currency, rightUnit)(rawLeftValue)
      const rightValue = rawRightValue / 10 ** rightUnit.magnitude
      this.setState({ rightValue, leftValue })
      onChange({ left: rawLeftValue, right: rawRightValue })
    } else if (changedField === 'right') {
      let rawRightValue = val * 10 ** rightUnit.magnitude
      let rawLeftValue = getReverseCounterValue(account.currency, rightUnit)(rawRightValue)
      if (rawLeftValue > max) {
        rawLeftValue = max
        rawRightValue = getCounterValue(account.currency, rightUnit)(rawLeftValue)
      }
      const rightValue = rawRightValue / 10 ** rightUnit.magnitude
      const leftValue = rawLeftValue / 10 ** account.unit.magnitude
      this.setState({ rightValue, leftValue })
      onChange({ left: rawLeftValue, right: rawRightValue })
    }
  }

  render() {
    const { t } = this.props
    const { leftUnit, rightUnit, leftValue, rightValue } = this.state

    return (
      <Box horizontal flow="5">
        <Box horizontal align="center">
          <InputCurrency
            containerProps={{ style: { width: 156 } }}
            unit={leftUnit}
            value={leftValue}
            onChange={this.handleChangeAmount('left')}
            renderRight={<InputRight>{leftUnit.code}</InputRight>}
          />
          <InputCenter>=</InputCenter>
          <InputCurrency
            containerProps={{ style: { width: 156 } }}
            unit={rightUnit}
            value={rightValue}
            onChange={this.handleChangeAmount('right')}
            renderRight={<InputRight>{rightUnit.code}</InputRight>}
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
