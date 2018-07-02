// @flow
import React, { Component } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import type { WalletBridge } from 'bridge/types'
import logger from 'logger'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import LabelInfoTooltip from 'components/base/LabelInfoTooltip'
import RecipientAddress from 'components/RecipientAddress'

type Props<Transaction> = {
  t: T,
  account: Account,
  bridge: WalletBridge<Transaction>,
  transaction: Transaction,
  onChangeTransaction: Transaction => void,
  autoFocus?: boolean,
}

class RecipientField<Transaction> extends Component<Props<Transaction>, { isValid: boolean }> {
  state = {
    isValid: true,
  }
  componentDidMount() {
    this.resync()
  }
  componentDidUpdate(nextProps: Props<Transaction>) {
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
    try {
      const isValid = await bridge.isRecipientValid(
        account.currency,
        bridge.getTransactionRecipient(account, transaction),
      )
      if (syncId !== this.syncId) return
      this.setState({ isValid })
    } catch (err) {
      logger.warn(`Can't check if recipient is valid`, err)
    }
  }

  onChange = (recipient: string, maybeExtra: ?Object) => {
    const { bridge, account, transaction, onChangeTransaction } = this.props
    const { amount, currency } = maybeExtra || {}
    if (currency && currency.scheme !== account.currency.scheme) return false
    let t = transaction
    if (amount) {
      t = bridge.editTransactionAmount(account, t, amount)
    }
    t = bridge.editTransactionRecipient(account, t, recipient)
    onChangeTransaction(t)
    return true
  }

  render() {
    const { bridge, account, transaction, t, autoFocus } = this.props
    const { isValid } = this.state
    const value = bridge.getTransactionRecipient(account, transaction)
    return (
      <Box flow={1}>
        <Label>
          <span>{t('app:send.steps.amount.recipientAddress')}</span>
          <LabelInfoTooltip ml={1} text={t('app:send.steps.amount.recipientAddress')} />
        </Label>
        <RecipientAddress
          autoFocus={autoFocus}
          withQrCode
          error={!value || isValid ? null : `This is not a valid ${account.currency.name} address`}
          value={value}
          onChange={this.onChange}
        />
      </Box>
    )
  }
}

export default RecipientField
