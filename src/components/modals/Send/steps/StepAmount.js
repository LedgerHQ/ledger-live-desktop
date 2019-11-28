// @flow

import React, { PureComponent, Fragment } from 'react'
import { getMainAccount } from '@ledgerhq/live-common/lib/account'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import AmountField from '../fields/AmountField'
import ErrorBanner from '../../../ErrorBanner'
import type { StepProps } from '../types'
import SendAmountFields from '../SendAmountFields'
import AccountFooter from '../AccountFooter'

export default ({
  t,
  account,
  parentAccount,
  transaction,
  onChangeTransaction,
  error,
  status,
  bridgePending,
}: StepProps) => {
  if (!status) return null
  const mainAccount = account ? getMainAccount(account, parentAccount) : null

  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step Amount" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      {account && transaction && mainAccount && (
        <Fragment key={account.id}>
          <AmountField
            status={status}
            account={account}
            parentAccount={parentAccount}
            transaction={transaction}
            onChangeTransaction={onChangeTransaction}
            bridgePending={bridgePending}
            t={t}
          />
          <SendAmountFields
            account={mainAccount}
            status={status}
            transaction={transaction}
            onChange={onChangeTransaction}
          />
        </Fragment>
      )}
    </Box>
  )
}

export class StepAmountFooter extends PureComponent<StepProps> {
  onNext = async () => {
    const { transitionTo } = this.props
    transitionTo('summary')
  }

  render() {
    const { t, account, parentAccount, status, bridgePending } = this.props
    const { errors } = status
    if (!account) return null

    const mainAccount = getMainAccount(account, parentAccount)
    const isTerminated = mainAccount.currency.terminated
    const hasErrors = Object.keys(errors).length
    const canNext = !bridgePending && !hasErrors && !isTerminated

    return (
      <Fragment>
        <AccountFooter parentAccount={parentAccount} account={account} status={status} />
        <Button isLoading={bridgePending} primary disabled={!canNext} onClick={this.onNext}>
          {t('common.continue')}
        </Button>
      </Fragment>
    )
  }
}
