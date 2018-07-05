// @flow

import type { Account, AccountRaw } from '@ledgerhq/live-common/lib/types'

type SplitConfig = {
  coinType: number,
}

export const isSegwitPath = (path: string): boolean => path.startsWith("49'")

export const isSegwitAccount = (account: Account | AccountRaw): boolean =>
  isSegwitPath(account.freshAddressPath)

export const isUnsplitPath = (path: string, splitConfig: SplitConfig) => {
  try {
    const coinType = parseInt(path.split('/')[1], 10)
    return coinType === splitConfig.coinType
  } catch (e) {
    return false
  }
}

export const isUnsplitAccount = (account: Account | AccountRaw, splitConfig: ?SplitConfig) =>
  !!splitConfig && isUnsplitPath(account.freshAddressPath, splitConfig)
