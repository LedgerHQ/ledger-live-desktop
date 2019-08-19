// @flow
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import { getAccountBridge } from 'bridge'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import RequestAmount from 'components/RequestAmount'
import Switch from 'components/base/Switch'
import { getMainAccount } from '@ledgerhq/live-common/lib/account/helpers'

// list of errors that are handled somewhere else on UI, otherwise the field will catch every other errors.
const blacklistErrorName = ['FeeNotLoaded', 'InvalidAddress', 'NotEnoughGas']

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
    account: Account | TokenAccount,
    parentAccount: ?Account,
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
  componentDidUpdate(prevProps: *) {
    if (
      prevProps.account !== this.props.account ||
      prevProps.transaction !== this.props.transaction
    ) {
      this.resync()
    }
  }
  componentWillUnmount() {
    this.syncId++
  }
  syncId = 0
  async resync() {
    const { account, parentAccount, transaction } = this.props
    const mainAccount = getMainAccount(account, parentAccount)
    const bridge = getAccountBridge(account, parentAccount)
    const syncId = ++this.syncId
    try {
      await bridge.checkValidTransaction(mainAccount, transaction)
      if (this.syncId !== syncId) return
      const maxAmount = await bridge.getMaxAmount(mainAccount, transaction)
      if (this.syncId !== syncId) return
      this.setState({ validTransactionError: null, maxAmount })
    } catch (validTransactionError) {
      if (this.syncId !== syncId) return
      this.setState({ validTransactionError, maxAmount: null })
    }
  }

  onChange = (amount: BigNumber) => {
    const { account, parentAccount, transaction, onChangeTransaction } = this.props
    const mainAccount = getMainAccount(account, parentAccount)
    const bridge = getAccountBridge(account, parentAccount)
    onChangeTransaction(bridge.editTransactionAmount(mainAccount, transaction, amount))
  }

  onChangeSendMax = (useAllAmount: boolean) => {
    const { account, parentAccount, transaction, onChangeTransaction } = this.props
    const mainAccount = getMainAccount(account, parentAccount)
    const bridge = getAccountBridge(account, parentAccount)
    let t = transaction
    t = bridge.editTransactionExtra(mainAccount, t, 'useAllAmount', useAllAmount)
    t = bridge.editTransactionAmount(mainAccount, t, BigNumber(0))
    onChangeTransaction(t)
  }

  render() {
    const { account, parentAccount, transaction, t } = this.props
    const { validTransactionError, maxAmount } = this.state
    const mainAccount = getMainAccount(account, parentAccount)
    const bridge = getAccountBridge(account, parentAccount)
    const useAllAmount = bridge.getTransactionExtra(mainAccount, transaction, 'useAllAmount')

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
              : bridge.getTransactionAmount(mainAccount, transaction)
          }
        />
      </Box>
    )
  }
}

export default AmountField
