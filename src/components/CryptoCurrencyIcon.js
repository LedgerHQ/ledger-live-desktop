// @flow
import React, { PureComponent } from 'react'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

type Props = {
  currency: CryptoCurrency,
  size: number,
  color?: string,
}

class CryptoCurrencyIcon extends PureComponent<Props> {
  render() {
    const { currency, size, color } = this.props
    const IconCurrency = getCryptoCurrencyIcon(currency)
    return IconCurrency ? <IconCurrency size={size} color={color} /> : null
  }
}

export default CryptoCurrencyIcon
