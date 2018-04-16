// @flow

import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { number } from '@storybook/addon-knobs'

import StepperNumber from 'components/base/StepperNumber'

const stories = storiesOf('Components/base', module)

class Wrapper extends Component<any, any> {
  state = {
    value: 0,
  }

  handleChange = value => {
    action('onChange')(value)
    this.setState({ value })
  }

  render() {
    const { render } = this.props
    const { value } = this.state

    return render({
      onChange: this.handleChange,
      value,
    })
  }
}

stories.add('StepperNumber', () => (
  <Wrapper
    render={({ value, onChange }) => (
      <StepperNumber
        min={number('min', 0)}
        max={number('max', 10)}
        step={number('step', 1)}
        onChange={onChange}
        value={value}
      />
    )}
  />
))
