// @flow

import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import InputPassword from 'components/base/InputPassword'

const stories = storiesOf('Components', module)

class Wrapper extends Component<any, any> {
  state = {
    value: 'p@ssw0rd!',
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

stories.add('InputPassword', () => (
  <Wrapper render={({ value, onChange }) => <InputPassword value={value} onChange={onChange} />} />
))
