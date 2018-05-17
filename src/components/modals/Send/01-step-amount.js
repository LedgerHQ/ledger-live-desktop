// @flow
import React, { Fragment } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import type { WalletBridge } from 'bridge/types'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import LabelInfoTooltip from 'components/base/LabelInfoTooltip'
import RecipientAddress from 'components/RecipientAddress'
import RequestAmount from 'components/RequestAmount'
import SelectAccount from 'components/SelectAccount'

const AccountField = ({ onChange, value, t }: *) => (
  <Box flow={1}>
    <Label>{t('send:steps.amount.selectAccountDebit')}</Label>
    <SelectAccount onChange={onChange} value={value} />
  </Box>
)

const RecipientField = ({ bridge, account, transaction, onChangeTransaction, t }: *) => (
  <Box flow={1}>
    <Label>
      <span>{t('send:steps.amount.recipientAddress')}</span>
      <LabelInfoTooltip ml={1} text={t('send:steps.amount.recipientAddress')} />
    </Label>
    <RecipientAddress
      withQrCode
      value={bridge.getTransactionRecipient(account, transaction)}
      onChange={recipient =>
        // TODO we should use isRecipientValid & provide a feedback to user
        onChangeTransaction(bridge.editTransactionRecipient(account, transaction, recipient))
      }
    />
  </Box>
)

const AmountField = ({ bridge, account, transaction, onChangeTransaction, t }: *) => (
  <Box flow={1}>
    <Label>{t('send:steps.amount.amount')}</Label>
    <RequestAmount
      withMax={false}
      account={account}
      onChange={amount =>
        onChangeTransaction(bridge.editTransactionAmount(account, transaction, amount))
      }
      value={bridge.getTransactionAmount(account, transaction)}
    />
  </Box>
)

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
