// @flow

import React, { PureComponent } from 'react'
import { storiesOf } from '@storybook/react'
import { text, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import { accounts } from 'components/SelectAccount/stories'

import RequestAmount from 'components/RequestAmount'

const stories = storiesOf('Components', module)

type State = {
  value: number,
}

class Wrapper extends PureComponent<any, State> {
  state = {
    value: 3e8,
  }
  handleChange = value => {
    action('onChange')(value)
    this.setState({ value })
  }
  render() {
    const { max, withMax } = this.props
    const { value } = this.state
    return (
      <RequestAmount
        account={accounts[0]}
        counterValue="USD"
        max={max}
        onChange={this.handleChange}
        value={value}
        withMax={withMax}
      />
    )
  }
}

stories.add('RequestAmount', () => (
  <Wrapper withMax={boolean('withMax', true)} max={Number(text('max', '4e8'))} />
))
