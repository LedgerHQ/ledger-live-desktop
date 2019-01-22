// @flow

import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { availableCurrencies } from 'reducers/settings'
import type { Option } from 'components/base/Select'

import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Select from 'components/base/Select'
import Box from 'components/base/Box'

type OwnProps = {
  onChange: (?Option) => void,
  currencies?: CryptoCurrency[],
  value?: CryptoCurrency,
  placeholder: string,
  autoFocus?: boolean,
  t: T,
}

type Props = OwnProps & {
  currencies: CryptoCurrency[],
}

const mapStateToProps = (state, props: OwnProps) => ({
  currencies: props.currencies || availableCurrencies(state),
})

const SelectCurrency = ({
  onChange,
  value,
  t,
  placeholder,
  currencies,
  autoFocus,
  ...props
}: Props) => {
  const options = currencies
    ? currencies.map(c => ({ ...c, value: c.id, label: c.name, currency: c }))
    : []
  return (
    <Select
      autoFocus={autoFocus}
      value={value}
      renderOption={renderOption}
      renderValue={renderOption}
      options={options}
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

export default translate()(connect(mapStateToProps)(SelectCurrency))
