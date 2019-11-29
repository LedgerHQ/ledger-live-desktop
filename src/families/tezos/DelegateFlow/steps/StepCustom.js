// @flow
import invariant from 'invariant'
import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { getMainAccount } from '@ledgerhq/live-common/lib/account'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'

import TrackPage from 'analytics/TrackPage'
import RecipientField from 'components/modals/Send/fields/RecipientField'
import Button from 'components/base/Button'
import Box from 'components/base/Box'

import CustomValidatorIcon from 'icons/CustomValidator'

import type { StepProps } from '../types'

const IconWrapper = styled(Box).attrs(() => ({
  p: 3,
}))`
  align-self: center;
  align-items: center;
  justify-content: center;
  background-color: ${p => p.theme.colors.palette.action.hover};
`

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
      <Box>
        <IconWrapper color="palette.primary.main">
          <CustomValidatorIcon size={30} />
        </IconWrapper>
      </Box>
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

  const initialTransaction = useRef(transaction)
  useEffect(() => {
    // empty the field
    onChangeTransaction(
      getAccountBridge(account, parentAccount).updateTransaction(initialTransaction.current, {
        recipient: '',
      }),
    )
  }, [onChangeTransaction, account, parentAccount])

  const onBack = useCallback(() => {
    // we need to revert
    onChangeTransaction(
      getAccountBridge(account, parentAccount).updateTransaction(transaction, {
        recipient: initialTransaction.current.recipient,
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
