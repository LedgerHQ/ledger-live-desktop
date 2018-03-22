// @flow

import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import Chance from 'chance'
import { getCurrencyByCoinType, getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import { SelectAccount } from 'components/SelectAccount'

const chance = new Chance()
const stories = storiesOf('Components', module)

export const accounts = [...Array(20)].map(() => ({
  id: chance.string(),
  address: chance.string(),
  addresses: [],
  balance: chance.integer({ min: 10000000000, max: 2000000000000 }),
  balanceByDay: {},
  coinType: 1,
  currency: getCurrencyByCoinType(1),
  index: chance.integer({ min: 0, max: 20 }),
  name: chance.name(),
  path: '',
  rootPath: '',
  operations: [],
  unit: getDefaultUnitByCoinType(1),
  settings: {
    minConfirmations: 2,
  },
}))

class Wrapper extends Component<any, any> {
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

stories.add('SelectAccount', () => (
  <Wrapper
    render={({ onChange, value }) => (
      <SelectAccount onChange={onChange} value={value} accounts={accounts} t={k => k} />
    )}
  />
))
