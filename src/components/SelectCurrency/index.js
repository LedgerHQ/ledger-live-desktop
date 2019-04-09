// @flow

import React from 'react'
import { translate } from 'react-i18next'
import Fuse from 'fuse.js'

import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import type { Option } from 'components/base/Select'

import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Select from 'components/base/Select'
import Box from 'components/base/Box'

import useCryptocurrencies from 'hooks/useCryptoCurrencies'

type Props = {
  onChange: (?Option) => void,
  currencies?: CryptoCurrency[],
  value?: CryptoCurrency,
  placeholder: string,
  autoFocus?: boolean,
  t: T,
}

const SelectCurrency = ({
  onChange,
  value,
  t,
  placeholder,
  currencies,
  autoFocus,
  ...props
}: Props) => {
  const availableCC = useCryptocurrencies()

  const cryptos = currencies || availableCC

  const options =
    cryptos && cryptos.length
      ? cryptos.map(c => ({ ...c, value: c, label: c.name, currency: c }))
      : []

  const fuseOptions = {
    threshold: 0.1,
    keys: ['name', 'ticker', 'value', 'label'],
  }

  const fuse = new Fuse(options, fuseOptions)

  const loadOptions = (inputValue?: string) =>
    new Promise(resolve => {
      window.requestAnimationFrame(() => {
        if (!inputValue) return resolve(options)

        const result = fuse.search(inputValue)
        return resolve(result)
      })
    })

  return (
    <Select
      async
      autoFocus={autoFocus}
      value={value}
      renderOption={renderOption}
      renderValue={renderOption}
      defaultOptions={options}
      loadOptions={loadOptions}
      placeholder={placeholder || t('common.selectCurrency')}
      noOptionsMessage={({ inputValue }: { inputValue: string }) =>
        t('common.selectCurrencyNoOption', { currencyName: inputValue })
      }
      onChange={item => onChange(item ? item.currency : null)}
      {...props}
    />
  )
}

const renderOption = (option: Option) => {
  const { data: currency } = option
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

export default translate()(SelectCurrency)
