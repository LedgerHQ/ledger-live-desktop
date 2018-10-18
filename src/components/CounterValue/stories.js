// @flow

import React from 'react'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'

import CounterValue from 'components/CounterValue'

const stories = storiesOf('Components', module)

const currency = getCryptoCurrencyById('bitcoin')

stories.add('CounterValue', () => (
  // $FlowFixMe
  <CounterValue currency={currency} value={number('value', 100000000)} />
))
