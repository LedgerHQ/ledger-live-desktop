// @flow

import React from 'react'
import { translate } from 'react-i18next'
import { getIconByCoinType } from '@ledgerhq/currencies/react'
import { listCurrencies } from '@ledgerhq/currencies'

import noop from 'lodash/noop'

import type { Currency } from '@ledgerhq/currencies'
import type { T } from 'types/common'

import Select from 'components/base/Select'
import Box from 'components/base/Box'

const renderItem = a => {
  const { color, name, coinType } = a
  const Icon = getIconByCoinType(coinType)
  return (
    <Box grow horizontal alignItems="center" flow={2}>
      {Icon && (
        <Box style={{ width: 16, height: 16, color }}>
          <Icon size={16} />
        </Box>
      )}
      <Box grow ff="Open Sans|SemiBold" color="dark" fontSize={4}>
        {name}
      </Box>
    </Box>
  )
}

const currencies = listCurrencies()

type Props = {
  onChange: Function,
  value?: Currency,
  t: T,
}

const SelectCurrency = ({ onChange, value, t, ...props }: Props) => (
  <Select
    {...props}
    value={value}
    renderSelected={renderItem}
    renderItem={renderItem}
    keyProp="coinType"
    items={currencies.sort((a, b) => (a.name < b.name ? -1 : 1))}
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
