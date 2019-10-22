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

const fallbackGasPrice = BigNumber(10e9)
let lastNetworkGasPrice // local cache of last value to prevent extra blinks

const FeesField = ({ onChange, account, transaction, status }: Props) => {
  invariant(transaction.family === 'ethereum', 'FeeField: ethereum family expected')

  const bridge = getAccountBridge(account)

  const onGasPriceChange = useCallback(
    gasPrice => {
      onChange(bridge.updateTransaction(transaction, { gasPrice }))
    },
    [onChange, transaction, bridge],
  )

  const networkGasPrice = transaction.networkInfo && transaction.networkInfo.gasPrice
  if (!lastNetworkGasPrice && networkGasPrice) {
    lastNetworkGasPrice = networkGasPrice
  }
  const defaultGasPrice = networkGasPrice || lastNetworkGasPrice || fallbackGasPrice
  const gasPrice = transaction.gasPrice || defaultGasPrice
  const { units } = account.currency

  return (
    <FeeSliderField
      defaultValue={defaultGasPrice}
      value={gasPrice}
      onChange={onGasPriceChange}
      unit={units.length > 1 ? units[1] : units[0]}
      error={status.errors.gasPrice}
    />
  )
}

export default FeesField
