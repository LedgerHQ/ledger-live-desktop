// @flow
import React, { PureComponent } from 'react'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

type Props = {
  currency: CryptoCurrency,
  size: number,
}

class CryptoCurrencyIcon extends PureComponent<Props> {
  render() {
    const { currency, size } = this.props
    const IconCurrency = getCryptoCurrencyIcon(currency)
    return IconCurrency ? <IconCurrency size={size} /> : null
  }
}

export default CryptoCurrencyIcon
