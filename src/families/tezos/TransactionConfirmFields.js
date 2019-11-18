// @flow
import React from 'react'
import TransactionConfirmField from 'components/TransactionConfirm/TransactionConfirmField'
import Text from 'components/base/Text'

const Pre = ({ account, transaction }: *) => (
  <>
    <TransactionConfirmField label="Source">
      <Text ff="Inter|Medium" color="palette.text.shade80" fontSize={2}>
        {account.freshAddress}
      </Text>
    </TransactionConfirmField>
    <TransactionConfirmField label="Delegate">
      <Text ff="Inter|Medium" color="palette.text.shade80" fontSize={2}>
        {transaction.recipient}
      </Text>
    </TransactionConfirmField>
  </>
)

const Post = ({ transaction }: *) => (
  <>
    <TransactionConfirmField label="Storage">
      <Text ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
        {transaction.storageLimit.toString()}
      </Text>
    </TransactionConfirmField>
  </>
)

export default {
  pre: Pre,
  post: Post,
}
