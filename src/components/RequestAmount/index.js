// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getDefaultUnitByCoinType, getFiatUnit } from '@ledgerhq/currencies'
import type { Account } from '@ledgerhq/wallet-common/lib/types'

import isNaN from 'lodash/isNaN'
import noop from 'lodash/noop'

import type { T } from 'types/common'

import { getCounterValue } from 'reducers/settings'
import { getLastCounterValueBySymbol } from 'reducers/counterValues'

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

const mapStateToProps = (state, { account }) => {
  const counterValue = getCounterValue(state)
  const unit = getDefaultUnitByCoinType(account.coinType)
  const symbol = `${unit.code}-${counterValue}`
  return {
    counterValue,
    lastCounterValue: getLastCounterValueBySymbol(symbol, state),
  }
}

function maxUnitDigits(unit, value) {
  const [leftDigits, rightDigits] = value.toString().split('.')

  return Number(`${leftDigits}${rightDigits ? `.${rightDigits.slice(0, unit.magnitude)}` : ''}`)
}

function calculateMax(props) {
  const { account, counterValue, lastCounterValue } = props

  const unit = getUnit({ account, counterValue })
  const leftMax = account.balance / 10 ** unit.left.magnitude

  return {
    left: account.balance / 10 ** unit.left.magnitude,
    right: maxUnitDigits(unit.right, leftMax * lastCounterValue),
  }
}

function getUnit({ account, counterValue }) {
  return {
    left: getDefaultUnitByCoinType(account.coinType),
    right: getFiatUnit(counterValue),
  }
}

function calculateValues({
  dir,
  value,
  max,
  lastCounterValue,
}: {
  dir: string,
  value: Object,
  max: Object,
  lastCounterValue: number,
}) {
  const v = value[dir]

  const getMax = (d, v) => {
    const result = v > max[d] ? max[d] : v
    return isNaN(result) ? '0' : result.toString()
  }

  const newValue = {}

  if (dir === 'left') {
    newValue.left = v === '' ? v : getMax('left', v)
    newValue.right = getMax('right', Number(v) * lastCounterValue)
  }

  if (dir === 'right') {
    newValue.left = getMax('left', Number(v) / lastCounterValue)
    newValue.right = v === '' ? v : getMax('right', v)
  }

  return newValue
}

type Direction = 'left' | 'right'

type Props = {
  account: Account,
  counterValue: string,
  lastCounterValue: number, // eslint-disable-line react/no-unused-prop-types
  onChange: Function,
  t: T,
  value: Object,
}

export type DoubleVal = {
  left: number,
  right: number,
}

type State = {
  max: DoubleVal,
  value: {
    left: string | number,
    right: string | number,
  },
}

export class RequestAmount extends PureComponent<Props, State> {
  static defaultProps = {
    onChange: noop,
    value: {},
  }

  constructor(props: Props) {
    super()

    this.props = props

    const max = calculateMax(props)

    let v = {
      left: 0,
      right: 0,
    }

    if (props.value.left) {
      v = calculateValues({
        ...props,
        dir: 'left',
        max,
      })
    }

    if (props.value.right) {
      v = calculateValues({
        ...props,
        dir: 'right',
        max,
      })
    }

    this.state = {
      max,
      value: v,
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.account !== nextProps.account) {
      const max = calculateMax(nextProps)
      this.setState({
        max,
        value: calculateValues({
          ...nextProps,
          dir: 'left',
          max,
        }),
      })
    }
  }

  componentDidUpdate(prevProps: Props) {
    this.updateValueWithProps(prevProps, this.props)
  }

  handleChangeAmount = (dir: Direction) => (v: number | string) => {
    const { onChange, value, account, counterValue, ...otherProps } = this.props
    const { max } = this.state

    const otherDir = dir === 'left' ? 'right' : 'left'
    const unit = getUnit({
      account,
      counterValue,
    })

    const newValue = calculateValues({
      ...otherProps,
      dir,
      value: {
        [dir]: v.toString(),
      },
      max,
    })
    newValue[otherDir] = maxUnitDigits(unit[otherDir], newValue[otherDir]).toString()

    this.setState({
      value: newValue,
    })
    onChange({
      values: newValue,
      rawValues: {
        left: Number(newValue.left) * 10 ** unit.left.magnitude,
        right: Number(newValue.right),
      },
    })
  }

  handleClickMax = () => {
    const { account } = this.props
    this.handleChangeAmount('left')(account.balance)
  }

  updateValueWithProps = (props: Props, nextProps: Props) => {
    if (
      props.value.left !== nextProps.value.left &&
      nextProps.value.left !== this.state.value.left
    ) {
      this.setState({
        value: calculateValues({
          ...nextProps,
          dir: 'left',
          max: this.state.max,
        }),
      })
    }

    if (
      props.value.right !== nextProps.value.right &&
      nextProps.value.right !== this.state.value.right
    ) {
      this.setState({
        value: calculateValues({
          ...nextProps,
          dir: 'right',
          max: this.state.max,
        }),
      })
    }
  }

  render() {
    const { account, counterValue, t } = this.props
    const { value } = this.state

    const unit = getUnit({
      account,
      counterValue,
    })

    return (
      <Box horizontal flow={5}>
        <Box horizontal>
          <InputCurrency
            containerProps={{
              style: {
                width: 156,
              },
            }}
            unit={unit.left}
            value={value.left}
            onChange={this.handleChangeAmount('left')}
            renderRight={<InputRight>{unit.left.code}</InputRight>}
          />
          <InputCenter>=</InputCenter>
          <InputCurrency
            containerProps={{
              style: {
                width: 156,
              },
            }}
            unit={unit.right}
            value={value.right}
            onChange={this.handleChangeAmount('right')}
            renderRight={<InputRight>{unit.right.code}</InputRight>}
          />
        </Box>
        <Box grow justifyContent="flex-end">
          <Button primary onClick={this.handleClickMax}>
            {t('common:max')}
          </Button>
        </Box>
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps), translate())(RequestAmount)
