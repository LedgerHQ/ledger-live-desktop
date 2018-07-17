// @flow

import type { Account } from '@ledgerhq/live-common/lib/types'

type Param = {
  accounts: Account[],
  accountsBtcBalance: number[],
  orderAccounts: string,
}

type SortMethod = 'name' | 'balance'

const sortMethod: { [_: SortMethod]: (Param) => string[] } = {
  balance: ({ accounts, accountsBtcBalance }) =>
    accounts
      .map((a, i) => [a.id, accountsBtcBalance[i]])
      .sort((a, b) => a[1] - b[1])
      .map(o => o[0]),

  name: ({ accounts }) =>
    accounts
      .slice(0)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(a => a.id),
}

export function sortAccounts(param: Param) {
  const [order, sort] = param.orderAccounts.split('|')
  if (order === 'name' || order === 'balance') {
    const ids = sortMethod[order](param)
    if (sort === 'asc') {
      ids.reverse()
    }
    return ids
  }
  return null
}
