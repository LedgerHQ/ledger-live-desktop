// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { getCurrencyColor } from '@ledgerhq/live-common/lib/currencies'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { lighten } from 'styles/helpers'

type Props = {
  currency: Currency,
  size: number,
}

const TokenIcon = styled.div`
  font-size: ${p => p.size / 2}px;
  font-family: 'Open Sans';
  font-weight: bold;
  color: ${p => p.color};
  background-color: ${p => lighten(p.color, 0.9)};
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
`

class CryptoCurrencyIcon extends PureComponent<Props> {
  render() {
    const { currency, size } = this.props
    const color = getCurrencyColor(currency)
    if (currency.type === 'FiatCurrency') {
      return null
    }
    if (currency.type === 'TokenCurrency') {
      return (
        <TokenIcon color={color} size={size}>
          {currency.ticker[0]}
        </TokenIcon>
      )
    }
    const IconCurrency = getCryptoCurrencyIcon(currency)
    return IconCurrency ? <IconCurrency size={size} color={color} /> : null
  }
}

export default CryptoCurrencyIcon
