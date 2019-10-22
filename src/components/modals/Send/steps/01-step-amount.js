// @flow

import React, { PureComponent, Fragment } from 'react'
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
} from '@ledgerhq/live-common/lib/types'
import {
  getMainAccount,
  getAccountCurrency,
  getAccountUnit,
} from '@ledgerhq/live-common/lib/account'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import SelectAccount from 'components/SelectAccount'
import FormattedVal from 'components/base/FormattedVal'
import CounterValue from 'components/CounterValue'
import Spinner from 'components/base/Spinner'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import FeeField from 'families/FeeField'
import AdvancedOptionsField from 'families/AdvancedOptionsField'
import RecipientField from '../fields/RecipientField'
import AmountField from '../fields/AmountField'
import HighFeeConfirmation from '../HighFeeConfirmation'
import ErrorBanner from '../../../ErrorBanner'
import type { StepProps } from '../types'

const AccountFields = ({
  account,
  parentAccount,
  transaction,
  onChangeTransaction,
  openedFromAccount,
  t,
  status,
  bridgePending,
}: {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  onChangeTransaction: Transaction => void,
  openedFromAccount: boolean,
  t: *,
  status: TransactionStatus,
  bridgePending: boolean,
}) => {
  const mainAccount = getMainAccount(account, parentAccount)
  return (
    <Fragment key={account.id}>
      <RecipientField
        status={status}
        autoFocus={openedFromAccount}
        account={mainAccount}
        transaction={transaction}
        onChangeTransaction={onChangeTransaction}
        bridgePending={bridgePending}
        t={t}
      />

      <AmountField
        status={status}
        account={account}
        parentAccount={parentAccount}
        transaction={transaction}
        onChangeTransaction={onChangeTransaction}
        t={t}
      />

      <FeeField
        account={mainAccount}
        status={status}
        transaction={transaction}
        onChange={onChangeTransaction}
      />

      <AdvancedOptionsField
        account={mainAccount}
        status={status}
        transaction={transaction}
        onChange={onChangeTransaction}
      />
    </Fragment>
  )
}

export default ({
  t,
  account,
  parentAccount,
  openedFromAccount,
  transaction,
  onChangeAccount,
  onChangeTransaction,
  error,
  status,
  bridgePending,
}: StepProps) => {
  if (!status) return null
  const mainAccount = account ? getMainAccount(account, parentAccount) : null

  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step 1" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box flow={1}>
        <Label>{t('send.steps.amount.selectAccountDebit')}</Label>
        <SelectAccount
          withSubAccounts
          enforceHideEmptySubAccounts
          autoFocus={!openedFromAccount}
          onChange={onChangeAccount}
          value={account}
        />
      </Box>

      {account && transaction && (
        <AccountFields
          status={status}
          error={error}
          key={account.id}
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          onChangeTransaction={onChangeTransaction}
          openedFromAccount={openedFromAccount}
          bridgePending={bridgePending}
          t={t}
        />
      )}
    </Box>
  )
}

export class StepAmountFooter extends PureComponent<
  StepProps,
  {
    highFeesOpen: boolean,
  },
> {
  state = {
    highFeesOpen: false,
  }

  onNext = async () => {
    const {
      transitionTo,
      status: { warnings },
    } = this.props
    if (Object.keys(warnings).includes('feeTooHigh')) {
      this.setState({ highFeesOpen: true })
    } else {
      transitionTo('device')
    }
  }

  onAcceptFees = () => {
    const { transitionTo } = this.props
    transitionTo('device')
  }

  onRejectFees = () => {
    this.setState({ highFeesOpen: false })
  }

  render() {
    const { t, account, parentAccount, status, bridgePending } = this.props
    const { highFeesOpen } = this.state
    const { amount, errors, totalSpent } = status

    const mainAccount = account ? getMainAccount(account, parentAccount) : null
    const currency = account ? getAccountCurrency(account) : null
    const accountUnit = account ? getAccountUnit(account) : null

    const isTerminated = mainAccount && mainAccount.currency.terminated
    const canNext =
      amount.gt(0) && !bridgePending && !Object.entries(errors).length && !isTerminated

    return (
      <Fragment>
        <Box grow>
          <Label>{t('send.totalSpent')}</Label>
          <Box horizontal flow={2} align="center">
            {accountUnit && (
              <FormattedVal
                disableRounding
                style={{ width: 'auto' }}
                color="palette.text.shade100"
                val={totalSpent}
                unit={accountUnit}
                showCode
              />
            )}
            <Box horizontal align="center">
              {account && (
                <CounterValue
                  prefix="("
                  suffix=")"
                  currency={currency}
                  value={totalSpent}
                  disableRounding
                  color="palette.text.shade60"
                  fontSize={3}
                  showCode
                  alwaysShowSign={false}
                />
              )}
            </Box>
            {bridgePending && <Spinner size={10} />}
          </Box>
        </Box>
        <Button primary disabled={!canNext} onClick={this.onNext}>
          {t('common.continue')}
        </Button>
        {amount && accountUnit && (
          <HighFeeConfirmation
            isOpened={highFeesOpen}
            onReject={this.onRejectFees}
            onAccept={this.onAcceptFees}
            fees={totalSpent.minus(amount)}
            amount={amount}
            unit={accountUnit}
          />
        )}
      </Fragment>
    )
  }
}
