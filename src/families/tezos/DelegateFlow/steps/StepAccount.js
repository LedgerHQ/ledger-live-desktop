// @flow

import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getMainAccount } from '@ledgerhq/live-common/lib/account'
import TrackPage from 'analytics/TrackPage'
import { delegatableAccountsSelector } from 'actions/general'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import { SelectAccount } from 'components/SelectAccount'
import ErrorBanner from 'components/ErrorBanner'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'

import type { StepProps } from '../types'

const mapStateToProps = createStructuredSelector({
  accounts: delegatableAccountsSelector,
})

const Select = connect(mapStateToProps)(SelectAccount)

export default ({
  t,
  account,
  parentAccount,
  openedFromAccount,
  onChangeAccount,
  error,
  status,
}: StepProps) => {
  if (!status) return null
  const mainAccount = account ? getMainAccount(account, parentAccount) : null

  return (
    <Box flow={4}>
      <TrackPage category="Delegation Flow" name="Step Account" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box flow={1}>
        <Label>{t('delegation.flow.steps.account.toDelegate')}</Label>
        <Select
          enforceHideEmptySubAccounts
          autoFocus={!openedFromAccount}
          onChange={onChangeAccount}
          value={account}
        />
      </Box>
    </Box>
  )
}

export const StepAccountFooter = ({
  t,
  account,
  parentAccount,
  bridgePending,
  transitionTo,
  closeModal,
}: StepProps) => {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null
  const isTerminated = mainAccount && mainAccount.currency.terminated
  const canNext = !bridgePending && !isTerminated

  const onNext = useCallback(() => transitionTo('summary'), [transitionTo])

  return (
    <>
      <Button onClick={closeModal} mr={1}>
        {t('common.cancel')}
      </Button>
      <Button isLoading={bridgePending} primary disabled={!canNext} onClick={onNext}>
        {t('common.continue')}
      </Button>
    </>
  )
}
