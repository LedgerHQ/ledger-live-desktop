// @flow
import React, { Component } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import type { WalletBridge } from 'bridge/types'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'
import Box from 'components/base/Box'
import LabelWithExternalIcon from 'components/base/LabelWithExternalIcon'
import RecipientAddress from 'components/RecipientAddress'
import { track } from 'analytics/segment'
import { InvalidAddress } from 'config/errors'

type Props<Transaction> = {
  t: T,
  account: Account,
  bridge: WalletBridge<Transaction>,
  transaction: Transaction,
  onChangeTransaction: Transaction => void,
  autoFocus?: boolean,
}

class RecipientField<Transaction> extends Component<
  Props<Transaction>,
  { isValid: boolean, warning: ?Error },
> {
  state = {
    isValid: true,
    warning: null,
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
    const recipient = bridge.getTransactionRecipient(account, transaction)
    const isValid = await bridge.isRecipientValid(account.currency, recipient)
    const warning = await bridge.getRecipientWarning(account.currency, recipient)
    if (syncId !== this.syncId) return
    this.setState({ isValid, warning })
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

  handleRecipientAddressHelp = () => {
    openURL(urls.recipientAddressInfo)
    track('Send Flow Recipient Address Help Requested')
  }
  render() {
    const { bridge, account, transaction, t, autoFocus } = this.props
    const { isValid, warning } = this.state
    const value = bridge.getTransactionRecipient(account, transaction)

    const error =
      !value || isValid ? null : new InvalidAddress(null, { currencyName: account.currency.name })

    return (
      <Box flow={1}>
        <LabelWithExternalIcon
          onClick={this.handleRecipientAddressHelp}
          label={t('app:send.steps.amount.recipientAddress')}
        />
        <RecipientAddress
          autoFocus={autoFocus}
          withQrCode={false}
          error={error}
          warning={warning}
          value={value}
          onChange={this.onChange}
        />
      </Box>
    )
  }
}

export default RecipientField
