// @flow

import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import SelectCurrency from 'components/SelectCurrency'

const stories = storiesOf('Components', module)

class Wrapper extends Component<any, any> {
  state = {
    value: '',
  }

  handleChange = item => {
    this.setState({ value: item })
    action('onChange')(item)
  }

  render() {
    const { render } = this.props
    const { value } = this.state

    return render({ onChange: this.handleChange, value })
  }
}

stories.add('SelectCurrency', () => (
  <Wrapper render={({ onChange, value }) => <SelectCurrency onChange={onChange} value={value} />} />
))
