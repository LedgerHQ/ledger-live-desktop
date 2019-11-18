// @flow
import React, { useCallback } from 'react'
import { RecipientRequired } from '@ledgerhq/errors'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import type { T } from 'types/common'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import RecipientAddress from 'components/RecipientAddress'

type Props = {
  account: Account,
  transaction: Transaction,
  autoFocus?: boolean,
  status: TransactionStatus,
  onChangeTransaction: Transaction => void,
  t: T,
}

const RecipientField = ({
  t,
  account,
  transaction,
  onChangeTransaction,
  autoFocus,
  status,
}: Props) => {
  const bridge = getAccountBridge(account, null)

  const onChange = useCallback(
    async (recipient: string, maybeExtra: ?Object) => {
      const { currency } = maybeExtra || {} // FIXME fromQRCode ?
      const invalidRecipient = currency && currency.scheme !== account.currency.scheme
      onChangeTransaction(
        bridge.updateTransaction(transaction, { recipient: invalidRecipient ? '' : recipient }),
      )
    },
    [bridge, account, transaction, onChangeTransaction],
  )

  if (!status) return null
  const { recipient: recipientError } = status.errors
  const { recipient: recipientWarning } = status.warnings

  return (
    <Box flow={1}>
      <Label>
        <span>{t('send.steps.details.recipientAddress')}</span>
      </Label>
      <RecipientAddress
        placeholder="Enter recipient address"
        autoFocus={autoFocus}
        withQrCode={!status.recipientIsReadOnly}
        readOnly={status.recipientIsReadOnly}
        error={recipientError instanceof RecipientRequired ? null : recipientError}
        warning={recipientWarning}
        value={transaction.recipient}
        onChange={onChange}
      />
    </Box>
  )
}

export default RecipientField
