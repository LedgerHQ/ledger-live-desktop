// @flow

import React, { PureComponent, Fragment } from 'react'
import { BigNumber } from 'bignumber.js'
import type { Account } from '@ledgerhq/live-common/lib/types'
import logger from 'logger'
import { getAccountBridge } from 'bridge'
import { listCryptoCurrencies } from 'config/cryptocurrencies'
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

const AccountFields = ({
  account,
  transaction,
  onChangeTransaction,
  openedFromAccount,
  t,
}: {
  account: Account,
  transaction: *,
  onChangeTransaction: (*) => void,
  openedFromAccount: boolean,
  t: *,
}) => (
  <Fragment key={account.id}>
    <RecipientField
      autoFocus={openedFromAccount}
      account={account}
      transaction={transaction}
      onChangeTransaction={onChangeTransaction}
      t={t}
    />

    <AmountField
      account={account}
      transaction={transaction}
      onChangeTransaction={onChangeTransaction}
      t={t}
    />

    <FeeField account={account} transaction={transaction} onChange={onChangeTransaction} />

    <AdvancedOptionsField
      account={account}
      transaction={transaction}
      onChange={onChangeTransaction}
    />
  </Fragment>
)

export default ({
  t,
  account,
  openedFromAccount,
  transaction,
  onChangeAccount,
  onChangeTransaction,
}: StepProps<*>) => (
  <Box flow={4}>
    <TrackPage category="Send Flow" name="Step 1" />
    {account ? <CurrencyDownStatusAlert currency={account.currency} /> : null}

    <Box flow={1}>
      <Label>{t('send.steps.amount.selectAccountDebit')}</Label>
      <SelectAccount autoFocus={!openedFromAccount} onChange={onChangeAccount} value={account} />
    </Box>

    {account &&
      transaction && (
        <AccountFields
          key={account.id}
          account={account}
          transaction={transaction}
          onChangeTransaction={onChangeTransaction}
          openedFromAccount={openedFromAccount}
          t={t}
        />
      )}
  </Box>
)

export class StepAmountFooter extends PureComponent<
  StepProps<*>,
  {
    totalSpent: BigNumber,
    canNext: boolean,
    isSyncing: boolean,
    highFeesOpen: boolean,
  },
> {
  state = {
    isSyncing: false,
    highFeesOpen: false,
    totalSpent: BigNumber(0),
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
    const { account, transaction } = this.props
    const syncId = ++this.syncId
    if (!account || !transaction) {
      this.setState({ canNext: false, isSyncing: false })
      return
    }
    this.setState({ isSyncing: true })

    const bridge = getAccountBridge(account)
    try {
      const totalSpent = await bridge.getTotalSpent(account, transaction)
      if (syncId !== this.syncId) return

      const isRecipientValid = await bridge
        .checkValidRecipient(account, bridge.getTransactionRecipient(account, transaction))
        .then(() => true, () => false)
      if (syncId !== this.syncId) return

      const isValidTransaction = await bridge
        .checkValidTransaction(account, transaction)
        .then(() => true, () => false)
      if (syncId !== this.syncId) return

      const amount = bridge.getTransactionAmount(account, transaction)
      const canNext =
        !amount.isZero() && isRecipientValid && !!isValidTransaction && totalSpent.gt(0)
      this.setState({ totalSpent, canNext, isSyncing: false })
    } catch (err) {
      logger.critical(err)
      this.setState({ totalSpent: BigNumber(0), canNext: false, isSyncing: false })
    }
  }

  onNext = async () => {
    const { totalSpent } = this.state
    const { transitionTo, account, transaction } = this.props
    if (account && transaction) {
      if (
        totalSpent
          .minus(transaction.amount)
          .times(10)
          .gt(transaction.amount)
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
    const { t, account, transaction } = this.props
    const { isSyncing, totalSpent, canNext, highFeesOpen } = this.state
    const bridge = account && getAccountBridge(account)
    const amount =
      bridge && account && transaction && bridge.getTransactionAmount(account, transaction)
    const isTerminated =
      account && listCryptoCurrencies(true, true).some(coin => coin.name === account.currency.name)

    return (
      <Fragment>
        <Box grow>
          <Label>{t('send.totalSpent')}</Label>
          <Box horizontal flow={2} align="center">
            {account && (
              <FormattedVal
                disableRounding
                style={{ width: 'auto' }}
                color="dark"
                val={totalSpent}
                unit={account.unit}
                showCode
              />
            )}
            <Box horizontal align="center">
              <Text ff="Rubik" fontSize={3}>
                {'(' /* eslint-disable-line react/jsx-no-literals */}
              </Text>
              {account && (
                <CounterValue
                  currency={account.currency}
                  value={totalSpent}
                  disableRounding
                  color="grey"
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
        {amount &&
          account && (
            <HighFeeConfirmation
              isOpened={highFeesOpen}
              onReject={this.onRejectFees}
              onAccept={this.onAcceptFees}
              fees={totalSpent.minus(amount)}
              amount={amount}
              unit={account.unit}
            />
          )}
      </Fragment>
    )
  }
}
