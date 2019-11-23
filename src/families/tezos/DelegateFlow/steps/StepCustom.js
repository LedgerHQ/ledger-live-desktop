// @flow
import invariant from 'invariant'
import React, { useCallback, useRef } from 'react'
import { getMainAccount } from '@ledgerhq/live-common/lib/account'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import TrackPage from 'analytics/TrackPage'
import RecipientField from 'components/modals/Send/fields/RecipientField'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import type { StepProps } from '../types'

export default ({
  account,
  parentAccount,
  transaction,
  status,
  onChangeTransaction,
  t,
}: StepProps) => {
  invariant(account && transaction, 'account & transaction is required')
  const mainAccount = getMainAccount(account, parentAccount)
  return (
    <Box flow={4} mx={40}>
      <TrackPage category="Delegation Flow" name="Step Custom" />
      <Box my={24}>
        <RecipientField
          label="Validator address"
          account={mainAccount}
          transaction={transaction}
          status={status}
          onChangeTransaction={onChangeTransaction}
          autoFocus
          t={t}
        />
      </Box>
    </Box>
  )
}
export const StepCustomFooter = ({
  t,
  transaction,
  onChangeTransaction,
  account,
  parentAccount,
  status,
  bridgePending,
  transitionTo,
}: StepProps) => {
  invariant(account && transaction, 'account and transaction')
  const { errors } = status
  const canNext = !bridgePending && !Object.keys(errors).length

  const initialRecipient = useRef(transaction.recipient)
  const onBack = useCallback(() => {
    // we need to revert
    onChangeTransaction(
      getAccountBridge(account, parentAccount).updateTransaction(transaction, {
        recipient: initialRecipient.current,
      }),
    )
    transitionTo('summary')
  }, [account, parentAccount, onChangeTransaction, transaction, transitionTo])

  const onNext = useCallback(() => {
    transitionTo('summary')
  }, [transitionTo])

  return (
    <>
      <Button secondary onClick={onBack}>
        {t('common.back')}
      </Button>
      <Button primary disabled={!canNext} onClick={onNext}>
        {t('common.continue')}
      </Button>
    </>
  )
}
