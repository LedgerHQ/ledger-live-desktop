// @flow

import React, { PureComponent } from 'react'
import uncontrollable from 'uncontrollable'
import styled from 'styled-components'
import { formatCurrencyUnit } from '@ledgerhq/live-common/lib/helpers/currencies'

import noop from 'lodash/noop'
import isNaN from 'lodash/isNaN'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Select from 'components/base/LegacySelect'

import type { Unit } from '@ledgerhq/live-common/lib/types'

function parseValue(value) {
  return value.toString().replace(/,/g, '.')
}

function format(unit: Unit, value: number, { isFocused, showAllDigits }) {
  // FIXME do we need locale for the input too ?
  return formatCurrencyUnit(unit, value, {
    useGrouping: !isFocused,
    disableRounding: true,
    showAllDigits: !!showAllDigits && !isFocused,
  })
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

function stopPropagation(e) {
  e.stopPropagation()
}

type Props = {
  onChangeFocus: boolean => void,
  onChange: (number, Unit) => void, // FIXME Unit shouldn't be provided (this is not "standard" onChange)
  onChangeUnit: Unit => void,
  renderRight: any,
  unit: Unit,
  units: Unit[],
  value: number,
  showAllDigits?: boolean,
}

type State = {
  isFocused: boolean,
  displayValue: string,
}

class InputCurrency extends PureComponent<Props, State> {
  static defaultProps = {
    onChangeFocus: noop,
    onChange: noop,
    renderRight: null,
    units: [],
    value: 0,
    showAllDigits: false,
  }

  state = {
    isFocused: false,
    displayValue: '',
  }

  componentDidMount() {
    this.syncInput({ isFocused: false })
  }

  componentWillReceiveProps(nextProps: Props) {
    const { value, showAllDigits, unit } = this.props
    const needsToBeReformatted =
      value !== nextProps.value ||
      showAllDigits !== nextProps.showAllDigits ||
      unit !== nextProps.unit
    if (needsToBeReformatted) {
      const { isFocused } = this.state
      this.setState({
        displayValue:
          nextProps.value === 0
            ? ''
            : format(nextProps.unit, nextProps.value, {
                isFocused,
                showAllDigits: nextProps.showAllDigits,
              }),
      })
    }
  }

  handleChange = (v: string) => {
    v = parseValue(v)

    // allow to type directly `.` in input to have `0.`
    if (v.startsWith('.')) {
      v = `0${v}`
    }

    // forbid multiple 0 at start
    if (v === '' || v.startsWith('00')) {
      const { onChange, unit } = this.props
      onChange(0, unit)
      this.setState({ displayValue: '' })
      return
    }

    // Check if value is valid Number
    if (isNaN(Number(v))) {
      return
    }

    this.emitOnChange(v)
    this.setState({ displayValue: v || '' })
  }

  handleBlur = () => {
    this.syncInput({ isFocused: false })
    this.props.onChangeFocus(false)
  }

  handleFocus = () => {
    this.syncInput({ isFocused: true })
    this.props.onChangeFocus(true)
  }

  syncInput = ({ isFocused }: { isFocused: boolean }) => {
    const { value, showAllDigits, unit } = this.props
    this.setState({
      isFocused,
      displayValue:
        value === '' || value === 0 ? '' : format(unit, value, { isFocused, showAllDigits }),
    })
  }

  emitOnChange = (v: string) => {
    const { onChange, unit } = this.props
    const { displayValue } = this.state

    if (displayValue.toString() !== v.toString()) {
      const satoshiValue = Number(v) * 10 ** unit.magnitude
      onChange(satoshiValue, unit)
    }
  }

  renderItem = item => item.code

  renderSelected = item => <Currency>{item.code}</Currency>

  renderListUnits = () => {
    const { units, onChangeUnit, unit } = this.props
    const { isFocused } = this.state

    if (units.length <= 1) {
      return null
    }

    return (
      <Currencies onClick={stopPropagation}>
        <Select
          bg="lightGraphite"
          keyProp="code"
          flatLeft
          onChange={onChangeUnit}
          items={units}
          value={unit}
          renderItem={this.renderItem}
          renderSelected={this.renderSelected}
          fakeFocusRight={isFocused}
        />
      </Currencies>
    )
  }

  render() {
    const { renderRight, showAllDigits, unit } = this.props
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
        placeholder={format(unit, 0, { isFocused: false, showAllDigits })}
      />
    )
  }
}

export default uncontrollable(InputCurrency, {
  unit: 'onChangeUnit',
})
