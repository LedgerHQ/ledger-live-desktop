// @flow

import React, { PureComponent, Fragment } from 'react'
import {
  getMainAccount,
  getAccountCurrency,
  getAccountUnit,
} from '@ledgerhq/live-common/lib/account'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import FormattedVal from 'components/base/FormattedVal'
import CounterValue from 'components/CounterValue'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import AmountField from '../fields/AmountField'
import ErrorBanner from '../../../ErrorBanner'
import type { StepProps } from '../types'
import SendAmountFields from '../SendAmountFields'

export default ({
  t,
  account,
  parentAccount,
  transaction,
  onChangeTransaction,
  error,
  status,
}: StepProps) => {
  if (!status) return null
  const mainAccount = account ? getMainAccount(account, parentAccount) : null

  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step 1" />
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
          </Box>
        </Box>
        <Button
          isLoading={bridgePending && !Object.entries(errors).length}
          primary
          disabled={!canNext}
          onClick={this.onNext}
        >
          {t('common.continue')}
        </Button>
      </Fragment>
    )
  }
}
