// @flow

import React, { PureComponent, type ElementRef } from 'react'
import { BigNumber } from 'bignumber.js'
import uncontrollable from 'uncontrollable'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { localeSelector } from 'reducers/settings'
import { formatCurrencyUnit, sanitizeValueString } from '@ledgerhq/live-common/lib/currencies'
import noop from 'lodash/noop'
import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Select from 'components/base/Select'
import type { Unit } from '@ledgerhq/live-common/lib/types'

const unitGetOptionValue = unit => unit.magnitude

function format(unit: Unit, value: BigNumber, { locale, isFocused, showAllDigits, subMagnitude }) {
  return formatCurrencyUnit(unit, value, {
    locale,
    useGrouping: !isFocused,
    disableRounding: true,
    showAllDigits: !!showAllDigits && !isFocused,
    subMagnitude: value.isLessThan(1) ? subMagnitude : 0,
  })
}

const Currencies = styled(Box)`
  position: relative;
  top: -1px;
  right: -1px;
  width: 100px;
`

function stopPropagation(e) {
  e.stopPropagation()
}

type Props = {
  onChangeFocus: boolean => void,
  onChange: (BigNumber, Unit) => void, // FIXME Unit shouldn't be provided (this is not "standard" onChange)
  onChangeUnit: Unit => void,
  renderRight: any,
  unit: Unit,
  units: Unit[],
  value: ?BigNumber,
  showAllDigits?: boolean,
  subMagnitude: number,
  allowZero: boolean,
  locale: string,
  disabled?: boolean,
  forwardedRef: ?ElementRef<any>,
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
    value: null,
    showAllDigits: false,
    subMagnitude: 0,
    allowZero: false,
  }

  state = {
    isFocused: false,
    displayValue: '',
  }

  componentDidMount() {
    this.syncInput({ isFocused: false })
  }

  componentWillReceiveProps(nextProps: Props) {
    const { locale, value, showAllDigits, unit } = this.props
    const needsToBeReformatted =
      !this.state.isFocused &&
      (value !== nextProps.value ||
        showAllDigits !== nextProps.showAllDigits ||
        unit !== nextProps.unit)
    if (needsToBeReformatted) {
      const { isFocused } = this.state
      this.setState({
        displayValue:
          !nextProps.value || nextProps.value.isZero()
            ? ''
            : format(nextProps.unit, nextProps.value, {
                locale,
                isFocused,
                showAllDigits: nextProps.showAllDigits,
                subMagnitude: nextProps.subMagnitude,
              }),
      })
    }
  }

  handleChange = (v: string) => {
    const { onChange, unit, value, locale } = this.props
    const r = sanitizeValueString(unit, v, locale)
    const satoshiValue = BigNumber(r.value)
    if (!value || !value.isEqualTo(satoshiValue)) {
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
    const { value, showAllDigits, subMagnitude, unit, allowZero, locale } = this.props
    this.setState({
      isFocused,
      displayValue:
        !value || (value.isZero() && !allowZero)
          ? ''
          : format(unit, value, { locale, isFocused, showAllDigits, subMagnitude }),
    })
  }

  renderOption = item => item.data.code

  renderValue = item => item.data.code

  renderListUnits = () => {
    const { units, onChangeUnit, unit } = this.props
    const { isFocused } = this.state
    const avoidEmptyValue = value => value && onChangeUnit(value)
    if (units.length <= 1) {
      return null
    }

    return (
      <Currencies onClick={stopPropagation}>
        <Select
          onChange={avoidEmptyValue}
          options={units}
          value={unit}
          getOptionValue={unitGetOptionValue}
          renderOption={this.renderOption}
          renderValue={this.renderValue}
          fakeFocusRight={isFocused}
          isRight
        />
      </Currencies>
    )
  }

  render() {
    const { renderRight, showAllDigits, unit, subMagnitude, locale, disabled } = this.props
    const { displayValue } = this.state

    return (
      <Input
        {...this.props}
        ff="Inter"
        ref={this.props.forwardedRef}
        disabled={disabled}
        value={displayValue}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        renderRight={renderRight || this.renderListUnits()}
        placeholder={
          displayValue
            ? ''
            : format(unit, BigNumber(0), {
                locale,
                isFocused: false,
                showAllDigits,
                subMagnitude,
              })
        }
      />
    )
  }
}

const Connected = uncontrollable(
  connect(
    createStructuredSelector({
      locale: localeSelector,
    }),
  )(InputCurrency),
  {
    unit: 'onChangeUnit',
  },
)

// $FlowFixMe
export default React.forwardRef((props, ref) => <Connected {...props} forwardedRef={ref} />)
