// @flow
import React from 'react'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import BitcoinKind from './BitcoinKind'
import EthereumKind from './EthereumKind'
import RippleKind from './RippleKind'
import TezosKind from './TezosKind'

const byFamily = {
  bitcoin: BitcoinKind,
  ethereum: EthereumKind,
  ripple: RippleKind,
  tezos: TezosKind,
}

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
}

const FeeField = (props: Props) => {
  if (props.account.currency.family === 'tezos') return null
  const Cmp = byFamily[props.account.currency.family]
  if (!Cmp) return null
  return <Cmp {...props} />
}

export default FeeField
