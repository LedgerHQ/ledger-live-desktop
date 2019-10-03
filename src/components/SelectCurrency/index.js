// @flow

import React, { useCallback, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import Fuse from 'fuse.js'

import type { Currency } from '@ledgerhq/live-common/lib/types'
import {
  useCurrenciesByMarketcap,
  listSupportedCurrencies,
} from '@ledgerhq/live-common/lib/currencies'
import useEnv from 'hooks/useEnv'
import type { T } from 'types/common'
import type { Option } from 'components/base/Select'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Select from 'components/base/Select'
import Box from 'components/base/Box'

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
    const devMode = useEnv('MANAGER_DEV_MODE')
    let c =
      currencies ||
      // $FlowFixMe
      (listSupportedCurrencies(): Currency[])
    if (!devMode) {
      c = c.filter(c => c.type !== 'CryptoCurrency' || !c.isTestnetFor)
    }
    const [searchInputValue, setSearchInputValue] = useState('')

    const cryptos = useCurrenciesByMarketcap(c)
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
      shouldSort: false,
    }
    const manualFilter = useCallback(() => {
      const fuse = new Fuse(options, fuseOptions)
      return searchInputValue.length > 0 ? fuse.search(searchInputValue) : options
    }, [searchInputValue, options, fuseOptions])

    const filteredOptions = manualFilter()
    return (
      <Select
        autoFocus={autoFocus}
        value={value}
        options={filteredOptions}
        filterOption={false}
        getOptionValue={getOptionValue}
        renderOption={renderOption}
        renderValue={renderOption}
        onInputChange={v => setSearchInputValue(v)}
        inputValue={searchInputValue}
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
    <Box grow ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
      {`${currency.name} (${currency.ticker})`}
    </Box>
  </Box>
)

export default translate()(SelectCurrency)
