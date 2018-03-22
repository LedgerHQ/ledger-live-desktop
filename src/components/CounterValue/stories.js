// @flow

import React from 'react'
import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'
import { storiesOf } from '@storybook/react'
import { boolean, text } from '@storybook/addon-knobs'

import { CounterValue } from 'components/CounterValue'

const stories = storiesOf('Components', module)

const unit = getDefaultUnitByCoinType(0)

const counterValue = 'USD'
const counterValues = {
  'BTC-USD': {
    byDate: {
      '2018-01-09': 10000,
    },
    list: [['2018-01-09', 10000]],
  },
}

stories.add('CounterValue', () => (
  <CounterValue
    counterValue={counterValue}
    counterValues={counterValues}
    unit={unit}
    formatValue={boolean('formatValue', true)}
    value={Number(text('value', '100000000'))}
  />
))
