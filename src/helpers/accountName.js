// @flow
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

export const getAccountPlaceholderName = (
  c: CryptoCurrency,
  index: number,
  isLegacy: boolean = false,
) => `${c.name} ${index}${isLegacy ? ' (legacy)' : ''}`

export const getNewAccountPlaceholderName = (_c: CryptoCurrency, _index: number) => `New Account`
