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

function format(unit: Unit, value: Value) {
  let v = value === '' ? 0 : Number(value)
  v *= 10 ** unit.magnitude
  return formatCurrencyUnit(unit, v, {
    disableRounding: true,
    showAllDigits: false,
  })
}

function unformat(unit, value) {
  if (value === 0 || value === '') {
    return 0
  }

  let v = parseCurrencyUnit(unit, value.toString())
  v /= 10 ** unit.magnitude

  return v
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

type Value = string | number

type Props = {
  onChange: Function,
  renderRight: any,
  unit: Unit,
  units: Array<Unit>,
  value: Value,
}

type State = {
  isFocus: boolean,
  value: Value,
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
    value: this.props.value,
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.value !== nextProps.value) {
      const { isFocus } = this.state
      const value = isFocus ? nextProps.value : format(nextProps.unit, nextProps.value)
      this.setState({
        value,
      })
    }
  }

  handleChange = (v: Value) => {
    v = parseValue(v)

    // Check if value is valid Number
    if (isNaN(Number(v))) {
      return
    }

    this.emitOnChange(v)
    this.setState({
      value: v,
    })
  }

  handleBlur = () => {
    const { unit } = this.props
    const { value } = this.state

    const v = format(unit, value)

    this.setState({
      isFocus: false,
      value: v,
    })
  }

  handleFocus = () => {
    const { unit } = this.props

    this.setState(prev => ({
      isFocus: true,
      value: unformat(unit, prev.value),
    }))
  }

  emitOnChange = (v: Value) => {
    const { onChange, unit } = this.props
    const { value } = this.state

    if (value.toString() !== v.toString()) {
      onChange(Number(v), unit)
    }
  }

  renderListUnits = () => {
    const { unit, units, onChange } = this.props
    const { value } = this.state

    if (units.length <= 1) {
      return null
    }

    return (
      <Currencies onClick={e => e.stopPropagation()}>
        <Select
          bg="lightGraphite"
          keyProp="code"
          flatLeft
          onChange={item => onChange(unformat(item, value), item)}
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
    const { value } = this.state

    return (
      <Input
        {...this.props}
        ff="Rubik"
        value={value}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        renderRight={renderRight || this.renderListUnits()}
      />
    )
  }
}

export default InputCurrency
