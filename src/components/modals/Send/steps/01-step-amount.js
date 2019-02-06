// @flow

import React, { PureComponent, Fragment } from 'react'
import { BigNumber } from 'bignumber.js'

import logger from 'logger'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import SelectAccount from 'components/SelectAccount'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'
import CounterValue from 'components/CounterValue'
import Spinner from 'components/base/Spinner'
import TrackPage from 'analytics/TrackPage'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'

import RecipientField from '../fields/RecipientField'
import AmountField from '../fields/AmountField'

import type { StepProps } from '../index'

export default ({
  t,
  account,
  bridge,
  openedFromAccount,
  transaction,
  onChangeAccount,
  onChangeTransaction,
}: StepProps<*>) => {
  const FeesField = bridge && bridge.EditFees
  const AdvancedOptionsField = bridge && bridge.EditAdvancedOptions

  // TODO: figure out why flow can't understand when we put conditions in variables
  // e.g:
  // const hasTransaction = !!account && !!bridge && !!transaction

  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step 1" />
      {account ? <CurrencyDownStatusAlert currency={account.currency} /> : null}

      <Box flow={1}>
        <Label>{t('send.steps.amount.selectAccountDebit')}</Label>
        <SelectAccount autoFocus={!openedFromAccount} onChange={onChangeAccount} value={account} />
      </Box>

      {account &&
        bridge &&
        transaction && (
          <Fragment key={account.id}>
            <RecipientField
              autoFocus={openedFromAccount}
              account={account}
              bridge={bridge}
              transaction={transaction}
              onChangeTransaction={onChangeTransaction}
              t={t}
            />

            <AmountField
              account={account}
              bridge={bridge}
              transaction={transaction}
              onChangeTransaction={onChangeTransaction}
              t={t}
            />

            {FeesField && (
              <FeesField account={account} value={transaction} onChange={onChangeTransaction} />
            )}

            {AdvancedOptionsField && (
              <AdvancedOptionsField
                account={account}
                value={transaction}
                onChange={onChangeTransaction}
              />
            )}
          </Fragment>
        )}
    </Box>
  )
}

export class StepAmountFooter extends PureComponent<
  StepProps<*>,
  {
    totalSpent: BigNumber,
    canNext: boolean,
    isSyncing: boolean,
  },
> {
  state = {
    isSyncing: false,
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
    const { account, bridge, transaction } = this.props

    const syncId = ++this.syncId

    if (!account || !transaction || !bridge) {
      this.setState({ canNext: false, isSyncing: false })
      return
    }

    this.setState({ isSyncing: true })

    try {
      const totalSpent = await bridge.getTotalSpent(account, transaction)
      if (syncId !== this.syncId) return
      const isRecipientValid = await bridge.isRecipientValid(
        account,
        bridge.getTransactionRecipient(account, transaction),
      )
      if (syncId !== this.syncId) return
      const isValidTransaction = await bridge
        .checkValidTransaction(account, transaction)
        .then(result => result, () => false)

      if (syncId !== this.syncId) return
      const canNext =
        !transaction.amount.isZero() && isRecipientValid && isValidTransaction && totalSpent.gt(0)
      this.setState({ totalSpent, canNext, isSyncing: false })
    } catch (err) {
      logger.critical(err)
      this.setState({ totalSpent: BigNumber(0), canNext: false, isSyncing: false })
    }
  }

  render() {
    const { t, transitionTo, account } = this.props
    const { isSyncing, totalSpent, canNext } = this.state
    return (
      <Fragment>
        <Box grow>
          <Label>{t('send.totalSpent')}</Label>
          <Box horizontal flow={2} align="center">
            {account && (
              <FormattedVal
                disableRounding
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
        <Button disabled={!canNext} primary onClick={() => transitionTo('device')}>
          {t('common.continue')}
        </Button>
      </Fragment>
    )
  }
}
