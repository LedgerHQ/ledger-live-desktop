// @flow

import React from 'react'
import { translate } from 'react-i18next'
import { listCryptoCurrencies } from '@ledgerhq/live-common/lib/helpers/currencies'

import noop from 'lodash/noop'

import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Select from 'components/base/Select'
import Box from 'components/base/Box'

const renderItem = (currency: CryptoCurrency) => {
  const { color, name } = currency
  return (
    <Box grow horizontal alignItems="center" flow={2}>
      <Box style={{ width: 16, height: 16, color }}>
        <CryptoCurrencyIcon currency={currency} size={16} />
      </Box>
      <Box grow ff="Open Sans|SemiBold" color="dark" fontSize={4}>
        {name}
      </Box>
    </Box>
  )
}

const currencies = listCryptoCurrencies().sort((a, b) => a.name.localeCompare(b.name))

type Props = {
  onChange: Function,
  value?: CryptoCurrency,
  t: T,
}

const SelectCurrency = ({ onChange, value, t, ...props }: Props) => (
  <Select
    {...props}
    value={value}
    renderSelected={renderItem}
    renderItem={renderItem}
    keyProp="id"
    items={currencies}
    placeholder={t('common:selectCurrency')}
    fontSize={4}
    onChange={onChange}
  />
)

SelectCurrency.defaultProps = {
  onChange: noop,
  value: undefined,
}

export default translate()(SelectCurrency)
