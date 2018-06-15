// @flow

import React, { PureComponent } from 'react'
import uncontrollable from 'uncontrollable'
import styled from 'styled-components'
import { formatCurrencyUnit } from '@ledgerhq/live-common/lib/helpers/currencies'

import noop from 'lodash/noop'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Select from 'components/base/LegacySelect'

import type { Unit } from '@ledgerhq/live-common/lib/types'

// TODO move this back to live common
const numbers = '0123456789'
const sanitizeValueString = (
  unit: Unit,
  valueString: string,
): {
  display: string,
  value: string,
} => {
  let display = ''
  let value = ''
  let decimals = -1
  for (let i = 0; i < valueString.length; i++) {
    const c = valueString[i]
    if (numbers.indexOf(c) !== -1) {
      if (decimals >= 0) {
        decimals++
        if (decimals > unit.magnitude) break
        value += c
        display += c
      } else if (value !== '0') {
        value += c
        display += c
      }
    } else if (decimals === -1 && (c === ',' || c === '.')) {
      if (i === 0) display = '0'
      decimals = 0
      display += '.'
    }
  }
  for (let i = Math.max(0, decimals); i < unit.magnitude; ++i) {
    value += '0'
  }
  if (!value) value = '0'
  return { display, value }
}

function format(unit: Unit, value: number, { isFocused, showAllDigits, subMagnitude }) {
  // FIXME do we need locale for the input too ?
  return formatCurrencyUnit(unit, value, {
    useGrouping: !isFocused,
    disableRounding: true,
    showAllDigits: !!showAllDigits && !isFocused,
    subMagnitude: value < 1 ? subMagnitude : 0,
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
  subMagnitude: number,
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
    subMagnitude: 0,
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
      !this.state.isFocused &&
      (value !== nextProps.value ||
        showAllDigits !== nextProps.showAllDigits ||
        unit !== nextProps.unit)
    if (needsToBeReformatted) {
      const { isFocused } = this.state
      this.setState({
        displayValue:
          nextProps.value === 0
            ? ''
            : format(nextProps.unit, nextProps.value, {
                isFocused,
                showAllDigits: nextProps.showAllDigits,
                subMagnitude: nextProps.subMagnitude,
              }),
      })
    }
  }

  handleChange = (v: string) => {
    const { onChange, unit, value } = this.props
    const r = sanitizeValueString(unit, v)
    const satoshiValue = parseInt(r.value, 10)
    if (value !== satoshiValue) {
      onChange(satoshiValue, unit)
    }
    this.setState({ displayValue: r.display })
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
    const { value, showAllDigits, subMagnitude, unit } = this.props
    this.setState({
      isFocused,
      displayValue:
        value === '' || value === 0
          ? ''
          : format(unit, value, { isFocused, showAllDigits, subMagnitude }),
    })
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
    const { renderRight, showAllDigits, unit, subMagnitude } = this.props
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
        placeholder={format(unit, 0, { isFocused: false, showAllDigits, subMagnitude })}
      />
    )
  }
}

export default uncontrollable(InputCurrency, {
  unit: 'onChangeUnit',
})
