// @flow

import React, { useCallback } from 'react'
import { BigNumber } from 'bignumber.js'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import invariant from 'invariant'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import FeeSliderField from './FeeSliderField'

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
}

const fallbackFees = BigNumber(1e5)
let lastNetworkFees // local cache of last value to prevent extra blinks

const FeesField = ({ onChange, account, transaction, status }: Props) => {
  invariant(transaction.family === 'tezos', 'FeeField: tezos family expected')

  const bridge = getAccountBridge(account)

  const onFeesChange = useCallback(
    fees => {
      onChange(bridge.updateTransaction(transaction, { fees }))
    },
    [onChange, transaction, bridge],
  )

  const networkFees = transaction.networkInfo && transaction.networkInfo.fees
  if (!lastNetworkFees && networkFees) {
    lastNetworkFees = networkFees
  }
  const defaultFees = networkFees || lastNetworkFees || fallbackFees
  const fees = transaction.fees || defaultFees
  const { units } = account.currency

  return (
    <FeeSliderField
      defaultValue={defaultFees}
      value={fees}
      onChange={onFeesChange}
      unit={units.length > 1 ? units[1] : units[0]}
      error={status.errors.gasPrice}
    />
  )
}

export default FeesField
