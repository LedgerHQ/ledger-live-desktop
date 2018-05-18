// @flow

import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import noop from 'lodash/noop'

import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { availableCurrencies } from 'reducers/settings'

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

type OwnProps = {
  onChange: Function,
  currencies?: CryptoCurrency[],
  value?: CryptoCurrency,
  placeholder: string,
  t: T,
}

type Props = OwnProps & {
  currencies: CryptoCurrency[],
}

const mapStateToProps = (state, props: OwnProps) => ({
  currencies: props.currencies || availableCurrencies(state),
})

const SelectCurrency = ({ onChange, value, t, placeholder, currencies, ...props }: Props) => (
  <Select
    {...props}
    value={value}
    renderSelected={renderItem}
    renderItem={renderItem}
    keyProp="id"
    items={currencies}
    placeholder={placeholder || t('common:selectCurrency')}
    fontSize={4}
    onChange={onChange}
  />
)

SelectCurrency.defaultProps = {
  onChange: noop,
  value: undefined,
}

export default translate()(connect(mapStateToProps)(SelectCurrency))
