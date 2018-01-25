// @flow

import { formatCurrencyUnit } from '@ledgerhq/common/lib/data/currency'

export function formatBTC(v: string | number, options: Object = { alwaysShowSign: true }) {
  return formatCurrencyUnit(
    {
      name: 'bitcoin',
      code: 'BTC',
      symbol: 'b',
      magnitude: 8,
    },
    Number(v),
    options.alwaysShowSign,
    true,
  )
}
