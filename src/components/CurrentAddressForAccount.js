// @flow

import React from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'

import CurrentAddress from 'components/CurrentAddress'

type Props = {
  account: Account,
}

export default function CurrentAddressForAccount(props: Props) {
  const { account, ...p } = props

  // TODO: handle other cryptos than BTC-like
  let freshAddress = account.addresses[0]
  if (!freshAddress) {
    freshAddress = { str: '', path: '' }
  }

  return <CurrentAddress accountName={account.name} address={freshAddress.str} {...p} />
}
