// @flow

import React from 'react'
import { getCurrencyByCoinType, getDefaultUnitByCoinType } from '@ledgerhq/currencies'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import createHistory from 'history/createHashHistory'

import { CounterValue } from 'components/CounterValue'
import { calculateCounterValueSelector } from 'reducers/counterValues'
import createStore from 'renderer/createStore'

const stories = storiesOf('Components', module)

const currency = getCurrencyByCoinType(0)
const unit = getDefaultUnitByCoinType(0)

const counterValue = 'USD'
const counterValues = {
  BTC: {
    USD: {
      '2018-01-09': 10000,
    },
  },
}

const store = createStore(createHistory(), { counterValues })
const getCounterValue = calculateCounterValueSelector(store.getState())

stories.add('CounterValue', () => (
  <CounterValue
    getCounterValue={getCounterValue}
    counterValueCode={counterValue}
    counterValues={counterValues}
    ticker={currency.units[0].code}
    unit={unit}
    value={Number(text('value', '100000000'))}
  />
))
