// @flow

import React from 'react'
import { getCurrencyByCoinType, getDefaultUnitByCoinType } from '@ledgerhq/currencies'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'

import CounterValue from 'components/CounterValue'

const stories = storiesOf('Components', module)

const currency = getCurrencyByCoinType(0)
const unit = getDefaultUnitByCoinType(0)

stories.add('CounterValue', () => (
  <CounterValue
    ticker={currency.units[0].code}
    unit={unit}
    value={Number(number('value', 3) || 0)}
  />
))
