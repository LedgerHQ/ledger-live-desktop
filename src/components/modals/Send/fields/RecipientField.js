// @flow
import React, { Component } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { getAccountBridge } from 'bridge'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'
import Box from 'components/base/Box'
import LabelWithExternalIcon from 'components/base/LabelWithExternalIcon'
import RecipientAddress from 'components/RecipientAddress'
import { track } from 'analytics/segment'
import { CantScanQRCode } from '@ledgerhq/errors'

type Props<Transaction> = {
  t: T,
  account: Account,
  transaction: Transaction,
  onChangeTransaction: Transaction => void,
  autoFocus?: boolean,
}

class RecipientField<Transaction> extends Component<
  Props<Transaction>,
  { error: ?Error, warning: ?Error },
> {
  state = {
    error: null,
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
    this.isUnmounted = true
  }
  isUnmounted = false
  syncId = 0
  async resync() {
    const { account, transaction } = this.props
    const bridge = getAccountBridge(account)
    const syncId = ++this.syncId
    const recipient = bridge.getTransactionRecipient(account, transaction)
    try {
      const warning = !recipient ? null : await bridge.checkValidRecipient(account, recipient)
      if (syncId !== this.syncId) return
      if (this.isUnmounted) return
      this.setState({ error: null, warning })
    } catch (error) {
      if (syncId !== this.syncId) return
      if (this.isUnmounted) return
      this.setState({ error, warning: null })
    }
  }

  onChange = async (recipient: string, maybeExtra: ?Object) => {
    const { account, transaction, onChangeTransaction } = this.props
    const bridge = getAccountBridge(account)
    const { amount, currency, fromQRCode } = maybeExtra || {}
    if (currency && currency.scheme !== account.currency.scheme) {
      onChangeTransaction(bridge.editTransactionRecipient(account, transaction, ''))
      return false
    }
    let t = transaction
    if (amount) {
      t = bridge.editTransactionAmount(account, t, amount)
    }
    t = bridge.editTransactionRecipient(account, t, recipient)
    onChangeTransaction(t)

    try {
      const warning = fromQRCode ? await bridge.checkValidRecipient(account, recipient) : null
      if (this.isUnmounted) return false
      this.setState({ error: null, warning })
      return true
    } catch (error) {
      if (this.isUnmounted) return false
      this.setState({ error: new CantScanQRCode(), warning: null })
      return false
    }
  }

  handleRecipientAddressHelp = () => {
    openURL(urls.recipientAddressInfo)
    track('Send Flow Recipient Address Help Requested')
  }
  render() {
    const { account, transaction, t, autoFocus } = this.props
    const { error, warning } = this.state
    const bridge = getAccountBridge(account)
    const value = bridge.getTransactionRecipient(account, transaction)
    return (
      <Box flow={1}>
        <LabelWithExternalIcon
          onClick={this.handleRecipientAddressHelp}
          label={t('send.steps.amount.recipientAddress')}
        />
        <RecipientAddress
          autoFocus={autoFocus}
          withQrCode
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
