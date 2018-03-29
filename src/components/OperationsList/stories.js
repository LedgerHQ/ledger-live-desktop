// @flow

import React from 'react'
import { getCurrencyByCoinType, getDefaultUnitByCoinType } from '@ledgerhq/currencies'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import { accounts } from 'components/SelectAccount/stories'

import OperationsList from 'components/OperationsList'

const stories = storiesOf('Components', module)

const unit = getDefaultUnitByCoinType(0)

const account = ({ name }) => ({
  ...accounts[0],
  minConfirmations: 10,
  currency: getCurrencyByCoinType(0),
  name,
  coinType: 0,
  unit,
})

const operations = [
  {
    address: '5c6ea1716520c7d6e038d36a3223faced3c',
    hash: '5c6ea1716520c7d6e038d36a3223faced3c4b8f7ffb69d9fb5bd527d562fdb62',
    id: '5c6ea1716520c7d6e038d36a3223faced3c4b8f7ffb69d9fb5bd527d562fdb62',
    amount: 1.3e8,
    date: new Date('2018-01-09T16:03:52Z'),
    confirmations: 1,
    account: account({
      name: 'Account 1',
    }),
  },
  {
    address: '5c6ea1716520c7d6e038d36a3223faced3c',
    hash: '26bdf265d725db5bf9d96bff7f8b4c3decaf3223a63d830e6d7c0256171ae6c5',
    id: '26bdf265d725db5bf9d96bff7f8b4c3decaf3223a63d830e6d7c0256171ae6c5',
    amount: 1.6e8,
    date: new Date('2018-01-09T16:03:52Z'),
    confirmations: 11,
    account: account({
      name: 'Account 1',
    }),
  },
  {
    address: '27416a48caab90fab053b507b8b6b9d4',
    hash: '27416a48caab90fab053b507b8b6b9d48fba75421d3bfdbae4b85f64024bc9c4',
    id: '27416a48caab90fab053b507b8b6b9d48fba75421d3bfdbae4b85f64024bc9c4',
    amount: -6.5e8,
    date: new Date('2018-01-09T16:02:40Z'),
    confirmations: 11,
    account: account({
      name: 'Account 2',
    }),
  },
  {
    address: '27416a48caab90fab053b507b8b6b9d4',
    hash: '4c9cb42046f58b4eabdfb3d12457abf84d9b6b8b705b350baf09baac84a61472',
    id: '4c9cb42046f58b4eabdfb3d12457abf84d9b6b8b705b350baf09baac84a61472',
    amount: -4.2e8,
    date: new Date('2018-01-09T16:02:40Z'),
    confirmations: 1,
    account: account({
      name: 'Account 2',
    }),
  },
]

stories.add('OperationsList', () => (
  <OperationsList
    operations={operations}
    canShowMore={boolean('canShowMore')}
    withAccount={boolean('withAccount')}
  />
))
