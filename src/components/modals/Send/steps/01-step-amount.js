// @flow

import React, { PureComponent, Fragment } from 'react'
import { BigNumber } from 'bignumber.js'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import { getMainAccount, getAccountCurrency } from '@ledgerhq/live-common/lib/account'
import logger from 'logger'
import { getAccountBridge } from 'bridge'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import SelectAccount from 'components/SelectAccount'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'
import CounterValue from 'components/CounterValue'
import Spinner from 'components/base/Spinner'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import FeeField from 'families/FeeField'
import AdvancedOptionsField from 'families/AdvancedOptionsField'
import RecipientField from '../fields/RecipientField'
import AmountField from '../fields/AmountField'
import type { StepProps } from '..'
import HighFeeConfirmation from '../HighFeeConfirmation'
import ErrorBanner from '../../../ErrorBanner'

const AccountFields = ({
  account,
  parentAccount,
  transaction,
  onChangeTransaction,
  openedFromAccount,
  t,
}: {
  account: Account | TokenAccount,
  parentAccount: ?Account,
  transaction: *,
  onChangeTransaction: (*) => void,
  openedFromAccount: boolean,
  t: *,
}) => {
  const mainAccount = getMainAccount(account, parentAccount)
  return (
    <Fragment key={account.id}>
      <RecipientField
        autoFocus={openedFromAccount}
        account={mainAccount}
        transaction={transaction}
        onChangeTransaction={onChangeTransaction}
        t={t}
      />

      <AmountField
        account={account}
        parentAccount={parentAccount}
        transaction={transaction}
        onChangeTransaction={onChangeTransaction}
        t={t}
      />

      <FeeField account={mainAccount} transaction={transaction} onChange={onChangeTransaction} />

      <AdvancedOptionsField
        account={mainAccount}
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
}: StepProps<*>) => {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null
  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step 1" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box flow={1}>
        <Label>{t('send.steps.amount.selectAccountDebit')}</Label>
        <SelectAccount
          withTokenAccounts
          enforceHideEmptyTokenAccounts
          autoFocus={!openedFromAccount}
          onChange={onChangeAccount}
          value={account}
        />
      </Box>

      {account && transaction && !error && (
        <AccountFields
          error={error}
          key={account.id}
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          onChangeTransaction={onChangeTransaction}
          openedFromAccount={openedFromAccount}
          t={t}
        />
      )}
    </Box>
  )
}

export class StepAmountFooter extends PureComponent<
  StepProps<*>,
  {
    totalSpent: BigNumber,
    maxAmount: BigNumber,
    canNext: boolean,
    isSyncing: boolean,
    highFeesOpen: boolean,
  },
> {
  state = {
    isSyncing: false,
    highFeesOpen: false,
    totalSpent: BigNumber(0),
    maxAmount: BigNumber(0),
    canNext: false,
  }

  componentDidMount() {
    this.resync()
  }

  componentDidUpdate(nextProps: StepProps<*>) {
    if (
      nextProps.account !== this.props.account ||
      nextProps.transaction !== this.props.transaction
    ) {
      this.resync()
    }
  }

  componentWillUnmount() {
    this.syncId++
  }

  syncId = 0

  async resync() {
    const { account, parentAccount, transaction, error } = this.props
    const syncId = ++this.syncId
    if (!account || !transaction || error) {
      this.setState({ canNext: false, isSyncing: false })
      return
    }
    this.setState({ isSyncing: true })

    const bridge = getAccountBridge(account, parentAccount)
    const mainAccount = getMainAccount(account, parentAccount)
    try {
      const totalSpent = await bridge.getTotalSpent(mainAccount, transaction)
      if (syncId !== this.syncId) return

      const isRecipientValid = await bridge
        .checkValidRecipient(mainAccount, bridge.getTransactionRecipient(mainAccount, transaction))
        .then(() => true, () => false)
      if (syncId !== this.syncId) return

      const isValidTransaction = await bridge
        .checkValidTransaction(mainAccount, transaction)
        .then(() => true, () => false)
      if (syncId !== this.syncId) return

      const amount = bridge.getTransactionAmount(mainAccount, transaction)
      const useAllAmount = bridge.getTransactionExtra(mainAccount, transaction, 'useAllAmount')
      let maxAmount
      if (useAllAmount) maxAmount = await bridge.getMaxAmount(mainAccount, transaction)

      const canNext =
        (!amount.isZero() || (useAllAmount && maxAmount && !maxAmount.isZero())) &&
        isRecipientValid &&
        !!isValidTransaction &&
        totalSpent.gt(0)
      this.setState({ totalSpent, maxAmount, canNext, isSyncing: false })
    } catch (err) {
      logger.critical(err)
      this.setState({ totalSpent: BigNumber(0), canNext: false, isSyncing: false })
    }
  }

  onNext = async () => {
    const { totalSpent, maxAmount } = this.state
    const { transitionTo, account, parentAccount, transaction } = this.props
    if (account && transaction) {
      if (
        !parentAccount &&
        ((transaction.amount.gt(0) &&
          totalSpent
            .minus(transaction.amount)
            .times(10)
            .gt(transaction.amount)) ||
          (maxAmount &&
            maxAmount.gt(0) &&
            totalSpent
              .minus(maxAmount)
              .times(10)
              .gt(maxAmount)))
      ) {
        this.setState({ highFeesOpen: true })
        return
      }
    }
    transitionTo('device')
  }

  onAcceptFees = () => {
    const { transitionTo } = this.props
    transitionTo('device')
  }

  onRejectFees = () => {
    this.setState({ highFeesOpen: false })
  }

  render() {
    const { t, account, parentAccount, transaction } = this.props
    const { isSyncing, totalSpent, canNext, highFeesOpen, maxAmount } = this.state
    const mainAccount = account ? getMainAccount(account, parentAccount) : null
    const currency = account ? getAccountCurrency(account) : null
    let bridge
    try {
      bridge = account ? getAccountBridge(account, parentAccount) : null
    } catch (e) {
      bridge = null
    }
    const amount =
      bridge && mainAccount && transaction
        ? bridge.getTransactionAmount(mainAccount, transaction)
        : null
    const isTerminated = (mainAccount && mainAccount.currency.terminated) || false
    const accountUnit = !account
      ? null
      : account.type === 'Account'
      ? account.unit
      : account.token.units[0]

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
              <Text ff="Rubik" fontSize={3}>
                {'(' /* eslint-disable-line react/jsx-no-literals */}
              </Text>
              {account && (
                <CounterValue
                  currency={currency}
                  value={totalSpent}
                  disableRounding
                  color="palette.text.shade60"
                  fontSize={3}
                  showCode
                  alwaysShowSign={false}
                />
              )}
              <Text ff="Rubik" fontSize={3}>
                {')' /* eslint-disable-line react/jsx-no-literals */}
              </Text>
            </Box>
            {isSyncing && <Spinner size={10} />}
          </Box>
        </Box>
        <Button primary disabled={!canNext || !!isTerminated} onClick={this.onNext}>
          {t('common.continue')}
        </Button>
        {amount && accountUnit && (
          <HighFeeConfirmation
            isOpened={highFeesOpen}
            onReject={this.onRejectFees}
            onAccept={this.onAcceptFees}
            fees={totalSpent.minus(!amount.isZero() ? amount : maxAmount)}
            amount={!amount.isZero() ? amount : maxAmount}
            unit={accountUnit}
          />
        )}
      </Fragment>
    )
  }
}
