// @flow

import React, { useCallback, useMemo } from 'react'
import { translate } from 'react-i18next'
import Fuse from 'fuse.js'

import type { Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import type { Option } from 'components/base/Select'

import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Select from 'components/base/Select'
import Box from 'components/base/Box'

import useCryptocurrencies from 'hooks/useCryptoCurrencies'

type Props = {
  onChange: (?Currency) => void,
  currencies?: Currency[],
  value?: Currency,
  placeholder: string,
  autoFocus?: boolean,
  t: T,
}

const getOptionValue = c => c.id

const SelectCurrency = React.memo(
  ({ onChange, value, t, placeholder, currencies, autoFocus, ...props }: Props) => {
    const cryptos = currencies || useCryptocurrencies({ onlySupported: true })
    const onChangeCallback = useCallback(item => onChange(item ? item.currency : null), [onChange])
    const noOptionsMessage = useCallback(
      ({ inputValue }: { inputValue: string }) =>
        t('common.selectCurrencyNoOption', { currencyName: inputValue }),
      [t],
    )

    const options = useMemo(
      () => cryptos.map(c => ({ ...c, value: c, label: c.name, currency: c })),
      [cryptos],
    )

    const fuseOptions = {
      threshold: 0.1,
      keys: ['name', 'ticker'],
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
        getOptionValue={getOptionValue}
        renderOption={renderOption}
        renderValue={renderOption}
        defaultOptions={options}
        loadOptions={loadOptions}
        placeholder={placeholder || t('common.selectCurrency')}
        noOptionsMessage={noOptionsMessage}
        onChange={onChangeCallback}
        {...props}
      />
    )
  },
)

const renderOption = ({ data: currency }: Option) => (
  <Box grow horizontal alignItems="center" flow={2}>
    <CryptoCurrencyIcon currency={currency} size={16} />
    <Box grow ff="Open Sans|SemiBold" color="dark" fontSize={4}>
      {currency.name}
    </Box>
  </Box>
)

export default translate()(SelectCurrency)
