// @flow
import React, { useCallback } from 'react'
import { Trans } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
} from '@ledgerhq/live-common/lib/types'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import RequestAmount from 'components/RequestAmount'
import Switch from 'components/base/Switch'
import Text from 'components/base/Text'

type Props = {
  parentAccount: ?Account,
  account: AccountLike,
  transaction: Transaction,
  onChangeTransaction: (*) => void,
  status: TransactionStatus,
  t: *,
}

const AmountField = ({
  account,
  parentAccount,
  transaction,
  onChangeTransaction,
  status,
  t,
}: Props) => {
  const bridge = getAccountBridge(account, parentAccount)

  const onChange = useCallback(
    (amount: BigNumber) => {
      onChangeTransaction(bridge.updateTransaction(transaction, { amount }))
    },
    [bridge, transaction, onChangeTransaction],
  )

  const onChangeSendMax = useCallback(
    (useAllAmount: boolean) => {
      onChangeTransaction(
        bridge.updateTransaction(transaction, { useAllAmount, amount: BigNumber(0) }),
      )
    },
    [bridge, transaction, onChangeTransaction],
  )

  if (!status) return null
  const { useAllAmount } = transaction
  const { amount, errors, warnings } = status
  let { amount: amountError } = errors

  // we ignore zero case for displaying field error because field is empty.
  if (amount.eq(0)) {
    amountError = null
  }

  return (
    <Box flow={1}>
      <Box
        horizontal
        alignItems="center"
        justifyContent="space-between"
        style={{ width: '50%', paddingRight: 28 }}
      >
        <Label>{t('send.steps.details.amount')}</Label>
        {typeof useAllAmount === 'boolean' ? (
          <Box horizontal alignItems="center">
            <Text
              color="palette.text.shade40"
              ff="Inter|Medium"
              fontSize={10}
              style={{ paddingRight: 5 }}
              onClick={() => onChangeSendMax(!useAllAmount)}
            >
              <Trans i18nKey="send.steps.details.useMax" />
            </Text>
            <Switch small isChecked={useAllAmount} onChange={onChangeSendMax} />
          </Box>
        ) : null}
      </Box>
      <RequestAmount
        disabled={!!useAllAmount}
        account={account}
        validTransactionError={amountError}
        validTransactionWarning={warnings.amount}
        onChange={onChange}
        value={amount}
        autoFocus
      />
    </Box>
  )
}

export default AmountField
