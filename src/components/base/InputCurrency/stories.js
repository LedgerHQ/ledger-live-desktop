// @flow

import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'

import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import InputCurrency from 'components/base/InputCurrency'

const stories = storiesOf('Components', module)

const { units } = getCryptoCurrencyById('bitcoin')

class Wrapper extends Component<any, any> {
  state = {
    value: 0,
    unit: units[0],
  }

  handleChange = (value, unit) => {
    action('onChange')(value, unit)
    this.setState({ value, unit })
  }

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
      <InputCurrency
        value={value}
        defaultUnit={unit}
        units={units}
        onChange={onChange}
        showAllDigits={boolean('showAllDigits', false)}
      />
    )}
  />
))
