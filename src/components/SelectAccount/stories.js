// @flow

import React, { PureComponent } from 'react'
import { storiesOf } from '@storybook/react'
import Chance from 'chance'
import { getCurrencyByCoinType, getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import { SelectAccount } from 'components/SelectAccount'

const chance = new Chance()
const stories = storiesOf('Components/SelectAccount', module)

const accounts = [...Array(20)].map(() => ({
  id: chance.string(),
  address: chance.string(),
  addresses: [],
  balance: chance.floating({ min: 0, max: 20 }),
  balanceByDay: {},
  coinType: 0,
  currency: getCurrencyByCoinType(0),
  index: chance.integer({ min: 0, max: 20 }),
  name: chance.name(),
  path: '',
  rootPath: '',
  transactions: [],
  unit: getDefaultUnitByCoinType(0),
  settings: {
    minConfirmations: 2,
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
