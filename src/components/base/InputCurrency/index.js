// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { parseCurrencyUnit, formatCurrencyUnit } from '@ledgerhq/currencies'

import noop from 'lodash/noop'
import isNaN from 'lodash/isNaN'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Select from 'components/base/Select'

import type { Unit } from '@ledgerhq/currencies'

function parseValue(value) {
  return value.toString().replace(/,/g, '.')
}

function format(unit: Unit, value: number) {
  return formatCurrencyUnit(unit, value, {
    disableRounding: true,
    showAllDigits: false,
  })
}

function unformat(unit, value) {
  if (value === 0 || value === '') {
    return '0'
  }

  let v = parseCurrencyUnit(unit, value.toString())
  v /= 10 ** unit.magnitude

  return v.toString()
}

const Currencies = styled(Box)`
  position: relative;
  top: -1px;
  right: -1px;
`

const Currency = styled(Box).attrs({
  color: 'grey',
  fontSize: 2,
  pl: 2,
  pr: 1,
})``

type Props = {
  onChange: Function,
  renderRight: any,
  unit: Unit,
  units: Array<Unit>,
  value: number,
}

type State = {
  unit: Unit,
  isFocus: boolean,
  displayValue: string,
}

class InputCurrency extends PureComponent<Props, State> {
  static defaultProps = {
    onChange: noop,
    renderRight: null,
    units: [],
    value: 0,
  }

  state = {
    isFocus: false,
    displayValue: '0',
    unit: this.props.unit,
  }

  componentWillMount() {
    const { value } = this.props
    const { unit } = this.state
    const displayValue = format(unit, value)
    this.setState({ displayValue })
  }

  componentWillReceiveProps(nextProps: Props) {
    const { unit } = this.state
    if (this.props.value !== nextProps.value) {
      const { isFocus } = this.state
      const displayValue = isFocus
        ? (nextProps.value / 10 ** unit.magnitude).toString()
        : format(unit, nextProps.value)
      this.setState({ displayValue })
    }
  }

  handleChange = (v: string) => {
    // const { displayValue } = this.state
    v = parseValue(v)

    if (v.startsWith('00')) {
      return
    }

    // Check if value is valid Number
    if (isNaN(Number(v))) {
      return
    }

    this.emitOnChange(v)
    this.setState({ displayValue: v || '0' })
  }

  handleBlur = () => {
    const { value } = this.props
    const { unit } = this.state
    const v = format(unit, value)
    this.setState({ isFocus: false, displayValue: v })
  }

  handleFocus = () => {
    const { unit } = this.state

    this.setState(prev => ({
      isFocus: true,
      displayValue: unformat(unit, prev.displayValue),
    }))
  }

  emitOnChange = (v: string) => {
    const { onChange } = this.props
    const { displayValue, unit } = this.state

    if (displayValue.toString() !== v.toString()) {
      const satoshiValue = Number(v) * 10 ** unit.magnitude
      onChange(satoshiValue, unit)
    }
  }

  renderListUnits = () => {
    const { units, value } = this.props
    const { unit } = this.state

    if (units.length <= 1) {
      return null
    }

    return (
      <Currencies onClick={e => e.stopPropagation()}>
        <Select
          bg="lightGraphite"
          keyProp="code"
          flatLeft
          onChange={item => {
            this.setState({ unit: item, displayValue: format(item, value) })
            // onChange(unformat(item, value), item)
          }}
          items={units}
          value={unit}
          renderItem={item => item.code}
          renderSelected={item => <Currency>{item.code}</Currency>}
        />
      </Currencies>
    )
  }

  render() {
    const { renderRight } = this.props
    const { displayValue } = this.state

    return (
      <Input
        {...this.props}
        ff="Rubik"
        value={displayValue}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        renderRight={renderRight || this.renderListUnits()}
      />
    )
  }
}

export default InputCurrency
