// @flow
import React from 'react'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import EthereumKind from './EthereumKind'
import RippleKind from './RippleKind'

const byFamily = {
  ethereum: EthereumKind,
  ripple: RippleKind,
}

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
}

const FeeField = (props: Props) => {
  const Cmp = byFamily[props.account.currency.family]
  if (!Cmp) return null
  return <Cmp {...props} />
}

export default FeeField
