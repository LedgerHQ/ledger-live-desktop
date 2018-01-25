// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'

import TransactionsList from 'components/TransactionsList'

const stories = storiesOf('TransactionsList', module)

const transactions = [
  {
    hash: '5c6ea1716520c7d6e038d36a3223faced3c4b8f7ffb69d9fb5bd527d562fdb62',
    balance: 130000000,
    time: 1516809771,
  },
  {
    hash: '27416a48caab90fab053b507b8b6b9d48fba75421d3bfdbae4b85f64024bc9c4',
    balance: 65000000,
    time: 1516704444,
  },
]

stories.add('basic', () => <TransactionsList transactions={transactions} />)
