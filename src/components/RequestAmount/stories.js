// @flow

import React, { PureComponent } from 'react'
import { storiesOf } from '@storybook/react'
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
    const { value } = this.state
    return (
      <RequestAmount
        counterValue="USD"
        account={accounts[0]}
        onChange={this.handleChange}
        value={value}
        max={4e8}
      />
    )
  }
}

stories.add('RequestAmount', () => <Wrapper />)
