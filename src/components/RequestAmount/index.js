// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getDefaultUnitByCoinType, getFiatUnit } from '@ledgerhq/currencies'

import isNaN from 'lodash/isNaN'

import type { Account } from 'types/common'

import { getCounterValue } from 'reducers/settings'

import Input from 'components/base/Input'
import Box from 'components/base/Box'

const mapStateToProps = state => ({
  counterValue: getCounterValue(state),
  counterValues: state.counterValues,
})

function calculateMax(props) {
  const { account, counterValue, lastCounterValue } = props

  const unit = {
    currency: getDefaultUnitByCoinType(account.coinType),
    fiat: getFiatUnit(counterValue),
  }

  const leftMax = account.balance / 10 ** unit.currency.magnitude

  return {
    left: account.balance / 10 ** unit.currency.magnitude,
    right: leftMax * lastCounterValue,
  }
}

function formatCur(unit, val) {
  if (val === '') {
    return ''
  }
  if (val === '0' || val <= 0) {
    return 0
  }
  const factor = 10 ** unit.magnitude
  return (Math.round(val * factor) / factor).toFixed(unit.magnitude)
}

function cleanValue(value) {
  return {
    left: value.left || 0,
    right: value.right || 0,
  }
}

function parseValue(value) {
  return value.toString().replace(/,/, '.')
}

function getUnit({ account, counterValue }) {
  return {
    currency: getDefaultUnitByCoinType(account.coinType),
    fiat: getFiatUnit(counterValue),
  }
}

function calculateValues({
  dir,
  value,
  max,
  unit,
  lastCounterValue,
}: {
  dir: string,
  value: string | number,
  max: Object,
  unit: Object,
  lastCounterValue: number,
}) {
  value = parseValue(value)

  const getMax = (d, v) => {
    const result = v > max[d] ? max[d] : v
    return isNaN(result) ? 0 : result
  }

  const newValue = {}

  if (dir === 'left') {
    newValue.left = value === '' ? value : getMax('left', value)
    newValue.right = formatCur(unit.fiat, getMax('right', Number(value) * lastCounterValue))
  }

  if (dir === 'right') {
    newValue.left = formatCur(unit.currency, getMax('left', Number(value) / lastCounterValue))
    newValue.right = value === '' ? value : getMax('right', value)
  }

  return newValue
}

type Direction = 'left' | 'right'

type Props = {
  account: Account,
  lastCounterValue: number,
  counterValue: string,
  onChange: Function,
  value: Object,
}

type State = {
  max: {
    left: number,
    right: number,
  },
  value: {
    left: string | number,
    right: string | number,
  },
}

export class RequestAmount extends PureComponent<Props, State> {
  static defaultProps = {
    value: {},
  }

  constructor(props: Props) {
    super()

    this.props = props

    const max = calculateMax(props)

    let value = {}

    if (props.value.left) {
      value = {
        ...calculateValues({
          dir: 'left',
          value: props.value.left,
          max,
          lastCounterValue: props.lastCounterValue,
          unit: getUnit({
            account: props.account,
            counterValue: props.counterValue,
          }),
        }),
      }
    }

    if (props.value.right) {
      value = {
        ...calculateValues({
          dir: 'right',
          value: props.value.right,
          max,
          lastCounterValue: props.lastCounterValue,
          unit: getUnit({
            account: props.account,
            counterValue: props.counterValue,
          }),
        }),
      }
    }

    value = cleanValue(value)

    this.state = {
      max,
      value,
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.account !== nextProps.account) {
      this.setState({
        max: calculateMax(nextProps),
      })
    }

    if (this.props.value.left !== nextProps.value.left) {
      this.setState({
        value: cleanValue({
          ...calculateValues({
            dir: 'left',
            value: nextProps.value.left,
            max: this.state.max,
            lastCounterValue: nextProps.lastCounterValue,
            unit: getUnit({
              account: nextProps.account,
              counterValue: nextProps.counterValue,
            }),
          }),
        }),
      })
    }

    if (this.props.value.right !== nextProps.value.right) {
      this.setState({
        value: cleanValue({
          ...calculateValues({
            dir: 'right',
            value: nextProps.value.right,
            max: this.state.max,
            lastCounterValue: nextProps.lastCounterValue,
            unit: getUnit({
              account: nextProps.account,
              counterValue: nextProps.counterValue,
            }),
          }),
        }),
      })
    }
  }

  handleChangeAmount = (dir: Direction) => (v: string) => {
    const { onChange, lastCounterValue, account, counterValue } = this.props
    const { max } = this.state

    v = parseValue(v)

    // Check if value is valid Number
    if (isNaN(Number(v))) {
      return
    }

    const newValue = calculateValues({
      dir,
      value: v,
      max,
      lastCounterValue,
      unit: getUnit({
        account,
        counterValue,
      }),
    })

    this.setState({
      value: newValue,
    })

    onChange(cleanValue(newValue))
  }

  handleBlur = () =>
    this.setState(prev => ({
      value: cleanValue(prev.value),
    }))

  render() {
    const { value } = this.state
    const { account, counterValue } = this.props

    const unit = getUnit({
      account,
      counterValue,
    })

    return (
      <Box horizontal flow={2}>
        <Box grow horizontal flow={2}>
          <Box justifyContent="center">{unit.currency.code}</Box>
          <Box grow>
            <Input
              value={value.left}
              onBlur={this.handleBlur}
              onChange={this.handleChangeAmount('left')}
            />
          </Box>
        </Box>
        <Box justifyContent="center">=</Box>
        <Box grow horizontal flow={2}>
          <Box justifyContent="center">{unit.fiat.code}</Box>
          <Box grow>
            <Input
              value={value.right}
              onBlur={this.handleBlur}
              onChange={this.handleChangeAmount('right')}
            />
          </Box>
        </Box>
      </Box>
    )
  }
}

export default connect(mapStateToProps)(RequestAmount)
