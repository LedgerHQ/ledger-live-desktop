// @flow

import invariant from 'invariant'
import React, { useCallback } from 'react'
import { useBaker } from '@ledgerhq/live-common/lib/families/tezos/bakers'
import type { AccountLike, Account, Transaction } from '@ledgerhq/live-common/lib/types'
import { shortAddressPreview, getMainAccount } from '@ledgerhq/live-common/lib/account'
import { getDefaultExplorerView, getAddressExplorer } from '@ledgerhq/live-common/lib/explorers'
import { openURL } from 'helpers/linking'
import TransactionConfirmField from 'components/TransactionConfirm/TransactionConfirmField'
import Text from 'components/base/Text'

const addressStyle = {
  wordBreak: 'break-all',
  textAlign: 'right',
  maxWidth: '50%',
}

const Pre = ({
  account,
  parentAccount,
  transaction,
}: {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
}) => {
  const mainAccount = getMainAccount(account, parentAccount)
  const baker = useBaker(transaction.recipient)
  const explorerView = getDefaultExplorerView(mainAccount.currency)
  const bakerURL = getAddressExplorer(explorerView, transaction.recipient)
  const openBaker = useCallback(() => {
    if (bakerURL) openURL(bakerURL)
  }, [bakerURL])

  invariant(transaction.family === 'tezos', 'tezos transaction')

  const isDelegateOperation = transaction.mode === 'delegate'

  return (
    <>
      <TransactionConfirmField label="Source">
        <Text
          style={addressStyle}
          ml={1}
          ff="Inter|Medium"
          color="palette.text.shade80"
          fontSize={3}
        >
          {account.type === 'ChildAccount' ? account.address : mainAccount.freshAddress}{' '}
        </Text>
      </TransactionConfirmField>
      {isDelegateOperation ? (
        <>
          <TransactionConfirmField label="Validator">
            <Text
              onClick={openBaker}
              color="palette.primary.main"
              ml={1}
              ff="Inter|Medium"
              fontSize={3}
            >
              {baker ? baker.name : shortAddressPreview(transaction.recipient)}
            </Text>
          </TransactionConfirmField>
          <TransactionConfirmField label="Delegate">
            <Text
              style={addressStyle}
              ml={1}
              ff="Inter|Medium"
              color="palette.text.shade80"
              fontSize={3}
            >
              {transaction.recipient}
            </Text>
          </TransactionConfirmField>
        </>
      ) : null}
    </>
  )
}

const Post = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === 'tezos', 'tezos transaction')

  return (
    <TransactionConfirmField label="Storage">
      <Text ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
        {(transaction.storageLimit || '').toString()}
      </Text>
    </TransactionConfirmField>
  )
}

export default {
  pre: Pre,
  post: Post,
}
