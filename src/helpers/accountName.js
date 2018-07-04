// @flow
import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import { MAX_ACCOUNT_NAME_SIZE } from 'config/constants'

export const getAccountPlaceholderName = (
  c: CryptoCurrency,
  index: number,
  isLegacy: boolean = false,
  isUnsplit: boolean = false,
) => `${c.name} ${index + 1}${isLegacy ? ' (legacy)' : ''}${isUnsplit ? ' (unsplit)' : ''}`

export const getNewAccountPlaceholderName = getAccountPlaceholderName // same naming
// export const getNewAccountPlaceholderName = (_c: CryptoCurrency, _index: number) => `New Account`

export const validateNameEdition = (account: Account, name: ?string): string =>
  (
    (name || account.name || '').replace(/\s+/g, ' ').trim() ||
    account.name ||
    getAccountPlaceholderName(account.currency, account.index)
  ).slice(0, MAX_ACCOUNT_NAME_SIZE)
