// @flow

import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

type ConfirmationDefaults = {
  confirmationsNb: ?{
    min: number,
    def: number,
    max: number,
  },
}

export const currencySettingsDefaults = ({
  blockAvgTime,
}: CryptoCurrency): ConfirmationDefaults => {
  let confirmationsNb
  if (blockAvgTime) {
    const def = Math.ceil((30 * 60) / blockAvgTime) // 30 min approx validation
    confirmationsNb = { min: 1, def, max: 3 * def }
  }
  return {
    confirmationsNb,
  }
}
