// @flow

import React from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'

import CurrentAddress from 'components/CurrentAddress'

type Props = {
  account: Account,
}

export default function CurrentAddressForAccount(props: Props) {
  const { account, ...p } = props
  return <CurrentAddress account={account} address={account.freshAddress} {...p} />
}
