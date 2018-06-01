// @flow
import React, { Fragment } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import type { WalletBridge } from 'bridge/types'
import Box from 'components/base/Box'
import AccountField from './AccountField'
import RecipientField from './RecipientField'
import AmountField from './AmountField'

type PropsStepAmount<Transaction> = {
  t: T,
  account: ?Account,
  bridge: ?WalletBridge<Transaction>,
  transaction: ?Transaction,
  onChangeAccount: Account => void,
  onChangeTransaction: Transaction => void,
}

function StepAmount({
  t,
  account,
  bridge,
  transaction,
  onChangeAccount,
  onChangeTransaction,
}: PropsStepAmount<*>) {
  // TODO need to split each field into a component
  const FeesField = bridge && bridge.EditFees
  const AdvancedOptionsField = bridge && bridge.EditAdvancedOptions

  return (
    <Box flow={4}>
      <AccountField t={t} onChange={onChangeAccount} value={account} />

      {account && bridge && transaction ? (
        <Fragment key={account.id}>
          <RecipientField
            account={account}
            bridge={bridge}
            transaction={transaction}
            onChangeTransaction={onChangeTransaction}
            t={t}
          />

          <AmountField
            account={account}
            bridge={bridge}
            transaction={transaction}
            onChangeTransaction={onChangeTransaction}
            t={t}
          />

          {FeesField && (
            <FeesField account={account} value={transaction} onChange={onChangeTransaction} />
          )}

          {AdvancedOptionsField && (
            <AdvancedOptionsField
              account={account}
              value={transaction}
              onChange={onChangeTransaction}
            />
          )}
        </Fragment>
      ) : null}
    </Box>
  )
}

export default StepAmount
