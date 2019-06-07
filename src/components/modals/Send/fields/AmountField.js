// @flow
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { getEnv } from '@ledgerhq/live-common/lib/env'
import { getAccountBridge } from 'bridge'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import RequestAmount from 'components/RequestAmount'
import Switch from 'components/base/Switch'

// list of errors that are handled somewhere else on UI, otherwise the field will catch every other errors.
const blacklistErrorName = ['FeeNotLoaded', 'InvalidAddress']

const SendMax = ({ value, onChange }: { value: boolean, onChange: boolean => void }) => (
  <Box horizontal alignItems="center">
    <Label color="#aaa" style={{ paddingRight: 8 }} onClick={() => onChange(!value)}>
      <Trans i18nKey="send.steps.amount.useMax" />
    </Label>
    <Switch small isChecked={value} onChange={onChange} />
  </Box>
)

class AmountField extends Component<
  {
    account: Account,
    transaction: *,
    onChangeTransaction: (*) => void,
    t: *,
  },
  { validTransactionError: ?Error, maxAmount: ?BigNumber },
> {
  state = {
    validTransactionError: null,
    maxAmount: null,
  }
  componentDidMount() {
    this.resync()
  }
  componentDidUpdate(nextProps: *) {
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
    const bridge = getAccountBridge(account)
    const syncId = ++this.syncId
    try {
      await bridge.checkValidTransaction(account, transaction)
      if (this.syncId !== syncId) return
      const maxAmount = await bridge.getMaxAmount(account, transaction)
      if (this.syncId !== syncId) return
      this.setState({ validTransactionError: null, maxAmount })
    } catch (validTransactionError) {
      this.setState({ validTransactionError, maxAmount: null })
    }
  }

  onChange = (amount: BigNumber) => {
    const { account, transaction, onChangeTransaction } = this.props
    const bridge = getAccountBridge(account)
    onChangeTransaction(bridge.editTransactionAmount(account, transaction, amount))
  }

  onChangeSendMax = (useAllAmount: boolean) => {
    const { account, transaction, onChangeTransaction } = this.props
    const bridge = getAccountBridge(account)
    let t = transaction
    t = bridge.editTransactionExtra(account, t, 'useAllAmount', useAllAmount)
    t = bridge.editTransactionAmount(account, t, BigNumber(0))
    onChangeTransaction(t)
  }

  render() {
    const { account, transaction, t } = this.props
    const { validTransactionError, maxAmount } = this.state
    const bridge = getAccountBridge(account)
    const useAllAmount = getEnv('EXPERIMENTAL_SEND_MAX')
      ? bridge.getTransactionExtra(account, transaction, 'useAllAmount')
      : null

    return (
      <Box flow={1}>
        <Box horizontal alignItems="center">
          <Label>{t('send.steps.amount.amount')}</Label>
          {typeof useAllAmount === 'boolean' ? (
            <>
              <div
                style={{
                  margin: '0 10px',
                  width: '1px',
                  height: '8px',
                  background: '#dcdcdc',
                }}
              />
              <SendMax value={useAllAmount} onChange={this.onChangeSendMax} />
            </>
          ) : null}
        </Box>
        <RequestAmount
          disabled={!!useAllAmount}
          account={account}
          validTransactionError={
            validTransactionError && blacklistErrorName.includes(validTransactionError.name)
              ? null
              : validTransactionError
          }
          onChange={this.onChange}
          value={
            useAllAmount
              ? maxAmount || BigNumber(0)
              : bridge.getTransactionAmount(account, transaction)
          }
        />
      </Box>
    )
  }
}

export default AmountField
