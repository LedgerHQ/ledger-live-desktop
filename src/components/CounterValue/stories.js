// @flow

import React from 'react'
import { getCurrencyByCoinType } from '@ledgerhq/currencies'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'

import CounterValue from 'components/CounterValue'

const stories = storiesOf('Components', module)

const currency = getCurrencyByCoinType(0)

stories.add('CounterValue', () => (
  <CounterValue ticker={currency.units[0].code} value={Number(number('value', 100000000) || 0)} />
))
