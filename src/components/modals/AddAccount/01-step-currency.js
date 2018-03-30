// @flow

import React from 'react'

import { listCurrencies } from '@ledgerhq/currencies'

import type { Currency } from '@ledgerhq/currencies/lib/types'
import type { T } from 'types/common'

import get from 'lodash/get'

import Box from 'components/base/Box'
import Label from 'components/base/Label'
import Select from 'components/base/Select'

const currencies = listCurrencies().map(currency => ({
  key: currency.coinType,
  name: currency.name,
  data: currency,
}))

type Props = {
  onChangeCurrency: Function,
  currency: Currency | null,
  t: T,
}

export default (props: Props) => (
  <Box flow={1}>
    <Label>{props.t('common:currency')}</Label>
    <Select
      placeholder={props.t('common:chooseWalletPlaceholder')}
      onChange={item => props.onChangeCurrency(item.data)}
      renderSelected={item => item.name}
      items={currencies}
      value={
        props.currency ? currencies.find(c => c.key === get(props, 'currency.coinType')) : null
      }
    />
  </Box>
)
