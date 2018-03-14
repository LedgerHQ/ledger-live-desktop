// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import TransactionsList from 'components/TransactionsList'

const stories = storiesOf('Components', module)

const transactions = [
  {
    address: '5c6ea1716520c7d6e038d36a3223faced3c',
    hash: '5c6ea1716520c7d6e038d36a3223faced3c4b8f7ffb69d9fb5bd527d562fdb62',
    balance: 130000000,
    receivedAt: '2018-01-09T16:03:52Z',
  },
  {
    address: '27416a48caab90fab053b507b8b6b9d4',
    hash: '27416a48caab90fab053b507b8b6b9d48fba75421d3bfdbae4b85f64024bc9c4',
    balance: 65000000,
    receivedAt: '2018-01-09T16:02:40Z',
  },
]

stories.add('TransactionsList', () => (
  <TransactionsList transactions={transactions} canShowMore={boolean('canShowMore')} />
))
