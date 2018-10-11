// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import { translate } from 'react-i18next'
import { getFiatCurrencyByTicker } from '@ledgerhq/live-common/lib/currencies'

import BalanceInfos from './BalanceInfos'

const stories = storiesOf('Components', module)

const BalanceInfosComp = translate()(BalanceInfos)

stories.add('BalanceInfos', () => (
  <BalanceInfosComp
    since="month"
    counterValue={getFiatCurrencyByTicker('USD')}
    totalBalance={number('totalBalance', 1000, { min: 0 })}
    sinceBalance={number('sinceBalance', 500, { min: 0 })}
    refBalance={number('refBalance', 200, { min: 0 })}
  />
))
