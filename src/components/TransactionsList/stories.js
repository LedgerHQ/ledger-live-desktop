// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'

import TransactionsList from 'components/TransactionsList'

const stories = storiesOf('Components/TransactionsList', module)

const transactions = [
  {
    hash: '5c6ea1716520c7d6e038d36a3223faced3c4b8f7ffb69d9fb5bd527d562fdb62',
    balance: 130000000,
    received_at: '2018-01-09T16:03:52Z',
  },
  {
    hash: '27416a48caab90fab053b507b8b6b9d48fba75421d3bfdbae4b85f64024bc9c4',
    balance: 65000000,
    received_at: '2018-01-09T16:02:40Z',
  },
]

stories.add('basic', () => <TransactionsList transactions={transactions} />)
