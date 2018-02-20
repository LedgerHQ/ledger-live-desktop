// @flow

import React, { PureComponent } from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import RecipientAddress from 'components/RecipientAddress'

const stories = storiesOf('Components/RecipientAddress', module)

type State = {
  value: any,
}

class Wrapper extends PureComponent<any, State> {
  state = {
    value: '',
  }

  handleChange = item => this.setState({ value: item })

  render() {
    const { render } = this.props
    const { value } = this.state

    return render({ onChange: this.handleChange, value })
  }
}

stories.add('basic', () => (
  <Wrapper
    render={({ onChange, value }) => (
      <RecipientAddress
        withQrCode={boolean('withQrCode', true)}
        onChange={onChange}
        value={value}
      />
    )}
  />
))
