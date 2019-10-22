// @flow
import React from 'react'
import styled, { withTheme } from 'styled-components'
import { getCurrencyColor } from 'helpers/getCurrencyColor'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { rgba } from 'styles/helpers'

type Props = {
  currency: Currency,
  size: number,
  inactive?: boolean,
  theme: any,
}

// NB this is to avoid seeing the parent icon through
export const TokenIconWrapper = styled.div`
  border-radius: 4px;
`
export const TokenIcon = styled.div`
  font-size: ${p => (p.fontSize ? p.fontSize : p.size / 2)}px;
  font-family: 'Inter';
  font-weight: bold;
  color: ${p => p.color};
  background-color: ${p => rgba(p.color, 0.1)};
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
`

const CryptoCurrencyIcon = ({ currency, size, inactive, theme }: Props) => {
  const currencyColor = getCurrencyColor(currency, theme.colors.palette.background.paper)
  const color = inactive ? theme.colors.palette.text.shade60 : currencyColor

  if (currency.type === 'FiatCurrency') {
    return null
  }
  if (currency.type === 'TokenCurrency') {
    return (
      <TokenIconWrapper>
        <TokenIcon color={color} size={size}>
          {currency.ticker[0]}
        </TokenIcon>
      </TokenIconWrapper>
    )
  }
  const IconCurrency = getCryptoCurrencyIcon(currency)
  return IconCurrency ? <IconCurrency size={size} color={color} /> : null
}

export default withTheme(CryptoCurrencyIcon)
