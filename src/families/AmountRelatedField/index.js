// @flow
import React from 'react'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import EthereumKind from './EthereumKind'

const byFamily = {
  ethereum: EthereumKind,
}

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
}

const AmountRelatedField = (props: Props) => {
  const Cmp = byFamily[props.account.currency.family]
  if (!Cmp) return null
  return <Cmp {...props} />
}

export default AmountRelatedField
