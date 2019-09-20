// @flow
import React, { useCallback } from 'react'
import { Trans } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import type { AccountLike, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import RequestAmount from 'components/RequestAmount'
import Switch from 'components/base/Switch'
import styled from 'styled-components'

type Props = {
  account: AccountLike,
  transaction: Transaction,
  onChangeTransaction: (*) => void,
  status: TransactionStatus,
  t: *,
}

// list of errors that are handled somewhere else on UI, otherwise the field will catch every other errors.
const blacklistErrorName = ['FeeNotLoaded', 'InvalidAddress', 'NotEnoughGas']

const SendMaxSeparator = styled.div`
  margin: 0 10px;
  width: 1px;
  height: 8px;
  background: ${p => p.theme.colors.fog};
`

const AmountField = ({ account, transaction, onChangeTransaction, status, t }: Props) => {
  const onChange = useCallback(
    (amount: BigNumber) => onChangeTransaction({ ...transaction, amount }),
    [transaction, onChangeTransaction],
  )

  const onChangeSendMax = useCallback(
    (useAllAmount: boolean) => onChangeTransaction({ ...transaction, useAllAmount }),
    [transaction, onChangeTransaction],
  )

  if (!status) return null
  const { useAllAmount, amount, transactionError } = status

  return (
    <Box flow={1}>
      <Box horizontal alignItems="center">
        <Label>{t('send.steps.amount.amount')}</Label>
        {typeof useAllAmount === 'boolean' ? (
          <>
            <SendMaxSeparator />
            <Box horizontal alignItems="center">
              <Label
                color="#aaa"
                style={{ paddingRight: 8 }}
                onClick={() => onChangeSendMax(!useAllAmount)}
              >
                <Trans i18nKey="send.steps.amount.useMax" />
              </Label>
              <Switch small isChecked={useAllAmount} onChange={onChangeSendMax} />
            </Box>
          </>
        ) : null}
      </Box>
      <RequestAmount
        disabled={!!useAllAmount}
        account={account}
        validTransactionError={
          transactionError && blacklistErrorName.includes(transactionError.name)
            ? null
            : transactionError
        }
        onChange={onChange}
        value={amount}
      />
    </Box>
  )
}

export default AmountField
