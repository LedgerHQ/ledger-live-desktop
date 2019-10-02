// @flow

import React, { useCallback } from 'react'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import InputCurrency from 'components/base/InputCurrency'
import invariant from 'invariant'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
}

function FeesField({ account, transaction, onChange, status }: Props) {
  invariant(transaction.family === 'ripple', 'FeeField: ripple family expected')

  const bridge = getAccountBridge(account)

  const onChangeFee = useCallback(fee => onChange(bridge.updateTransaction(transaction, { fee })), [
    transaction,
    onChange,
    bridge,
  ])

  const { units } = account.currency
  const { errors } = status
  const { fee: feeError } = errors
  const { fee } = transaction

  return (
    <GenericContainer>
      <InputCurrency
        defaultUnit={units[0]}
        units={units}
        containerProps={{ grow: true }}
        loading={!feeError && !fee}
        error={feeError}
        value={fee}
        onChange={onChangeFee}
      />
    </GenericContainer>
  )
}

export default FeesField
