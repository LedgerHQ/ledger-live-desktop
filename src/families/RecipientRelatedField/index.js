// @flow
import React from 'react'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import RippleKind from './RippleKind'

const byFamily = {
  ripple: RippleKind,
}

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
}

const RecipientRelatedField = (props: Props) => {
  const Cmp = byFamily[props.account.currency.family]
  if (!Cmp) return null
  return <Cmp {...props} />
}

export default RecipientRelatedField
