// @flow
import type { Account, AccountRaw } from '@ledgerhq/live-common/lib/types'

export const isSegwitPath = (path: string): boolean => path.startsWith("49'")

export const isSegwitAccount = (account: Account | AccountRaw): boolean =>
  isSegwitPath(account.freshAddressPath)
