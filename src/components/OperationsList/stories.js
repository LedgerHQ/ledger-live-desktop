// @flow

import React from 'react'
import { getCurrencyByCoinType, getDefaultUnitByCoinType } from '@ledgerhq/currencies'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import { translate } from 'react-i18next'

import { accounts } from 'components/SelectAccount/stories'

import { OperationsList } from 'components/OperationsList'

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

const counterValue = 'USD'
const counterValues = {
  'BTC-USD': {
    byDate: {
      '2018-01-09': 10000,
    },
  },
}

const operations = [
  {
    address: '5c6ea1716520c7d6e038d36a3223faced3c',
    hash: '5c6ea1716520c7d6e038d36a3223faced3c4b8f7ffb69d9fb5bd527d562fdb62',
    amount: 130000000,
    date: '2018-01-09T16:03:52Z',
    confirmations: 1,
    account: account({
      name: 'Account 1',
    }),
  },
  {
    address: '5c6ea1716520c7d6e038d36a3223faced3c',
    hash: '5c6ea1716520c7d6e038d36a3223faced3c4b8f7ffb69d9fb5bd527d562fdb62',
    amount: 130000000,
    date: '2018-01-09T16:03:52Z',
    confirmations: 11,
    account: account({
      name: 'Account 1',
    }),
  },
  {
    address: '27416a48caab90fab053b507b8b6b9d4',
    hash: '27416a48caab90fab053b507b8b6b9d48fba75421d3bfdbae4b85f64024bc9c4',
    amount: -65000000,
    date: '2018-01-09T16:02:40Z',
    confirmations: 11,
    account: account({
      name: 'Account 2',
    }),
  },
  {
    address: '27416a48caab90fab053b507b8b6b9d4',
    hash: '27416a48caab90fab053b507b8b6b9d48fba75421d3bfdbae4b85f64024bc9c4',
    amount: -65000000,
    date: '2018-01-09T16:02:40Z',
    confirmations: 1,
    account: account({
      name: 'Account 2',
    }),
  },
]

const OperationsListComp = translate()(OperationsList)

stories.add('OperationsList', () => (
  <OperationsListComp
    counterValue={counterValue}
    counterValues={counterValues}
    operations={operations}
    canShowMore={boolean('canShowMore')}
    withAccount={boolean('withAccount')}
  />
))
