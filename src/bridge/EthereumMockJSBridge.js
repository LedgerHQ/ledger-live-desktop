// @flow
import React from 'react'
import EthereumKind from 'components/FeesField/EthereumKind'
import type { EditProps } from './types'
import makeMockBridge from './makeMockBridge'

const EditFees = ({ account, onChange, value }: EditProps<*>) => (
  <EthereumKind
    onChange={gasPrice => {
      onChange({ ...value, gasPrice })
    }}
    gasPrice={value.gasPrice}
    account={account}
  />
)

export default makeMockBridge({
  extraInitialTransactionProps: () => ({ gasPrice: 0 }),
  EditFees,
  getTotalSpent: (a, t) => Promise.resolve(t.amount + t.gasPrice),
  getMaxAmount: (a, t) => Promise.resolve(a.balance - t.gasPrice),
})
