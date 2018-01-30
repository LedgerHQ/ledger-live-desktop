// @flow

import React, { PureComponent } from 'react'
import { storiesOf } from '@storybook/react'
import Chance from 'chance'

import { SelectAccount } from 'components/SelectAccount'

const chance = new Chance()
const stories = storiesOf('SelectAccount', module)

const accounts = [...Array(20)].map(() => ({
  id: chance.string(),
  name: chance.name(),
  type: 'BTC',
  data: {
    address: chance.string(),
    balance: chance.floating({ min: 0, max: 20 }),
    currentIndex: chance.integer({ min: 0, max: 20 }),
    transactions: [],
  },
}))

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
      <SelectAccount onChange={onChange} value={value} accounts={accounts} t={k => k} />
    )}
  />
))
