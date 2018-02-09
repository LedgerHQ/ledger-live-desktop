// @flow

import { formatCurrencyUnit } from '@ledgerhq/currencies'

export function formatBTC(
  v: string | number,
  options: Object = { alwaysShowSign: true, showCode: true },
) {
  return formatCurrencyUnit(
    {
      name: 'bitcoin',
      code: 'BTC',
      symbol: 'b',
      magnitude: 8,
    },
    Number(v),
    options,
  )
}
