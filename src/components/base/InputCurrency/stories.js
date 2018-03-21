// @flow

import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'

import { getDefaultUnitByCoinType, getFiatUnit } from '@ledgerhq/currencies'

import InputCurrency from 'components/base/InputCurrency'

const stories = storiesOf('Components', module)

const units = [
  getDefaultUnitByCoinType(1),
  getDefaultUnitByCoinType(2),
  getDefaultUnitByCoinType(3),
  getDefaultUnitByCoinType(6),
  getFiatUnit('USD'),
]

class Wrapper extends Component<any, any> {
  state = {
    value: 0,
    unit: units[0],
  }

  handleChange = (value, unit) => this.setState({ value, unit })

  render() {
    const { render } = this.props
    const { value, unit } = this.state

    return render({
      onChange: this.handleChange,
      unit,
      value,
    })
  }
}

stories.add('InputCurrency', () => (
  <Wrapper
    render={({ value, unit, onChange }) => (
      <InputCurrency value={value} unit={unit} units={units} onChange={onChange} />
    )}
  />
))
