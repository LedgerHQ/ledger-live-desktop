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
import { createCustomErrorClass } from '@ledgerhq/errors/lib/helpers'
import { CantScanQRCode } from '@ledgerhq/errors'

type Props<Transaction> = {
  t: T,
  account: Account,
  bridge: WalletBridge<Transaction>,
  transaction: Transaction,
  onChangeTransaction: Transaction => void,
  autoFocus?: boolean,
}

const InvalidAddress = createCustomErrorClass('InvalidAddress')

class RecipientField<Transaction> extends Component<
  Props<Transaction>,
  { isValid: boolean, warning: ?Error, QRCodeRefusedReason: ?Error },
> {
  state = {
    isValid: true,
    warning: null,
    QRCodeRefusedReason: null,
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
    const { account, bridge, transaction } = this.props
    const syncId = ++this.syncId
    const recipient = bridge.getTransactionRecipient(account, transaction)
    const isValid = await bridge.isRecipientValid(account.currency, recipient, account.freshAddress)
    const warning = await bridge.getRecipientWarning(
      account.currency,
      recipient,
      account.freshAddress,
    )
    if (syncId !== this.syncId) return
    if (this.isUnmounted) return
    this.setState({ isValid, warning })
  }

  onChange = async (recipient: string, maybeExtra: ?Object) => {
    const { bridge, account, transaction, onChangeTransaction } = this.props
    const { QRCodeRefusedReason } = this.state
    const { amount, currency, fromQRCode } = maybeExtra || {}
    if (currency && currency.scheme !== account.currency.scheme) return false
    let t = transaction
    if (amount) {
      t = bridge.editTransactionAmount(account, t, amount)
    }
    const warning = fromQRCode
      ? await bridge.getRecipientWarning(account.currency, recipient)
      : null
    if (this.isUnmounted) return false
    if (warning) {
      // clear the input if field has warning AND has a warning
      t = bridge.editTransactionRecipient(account, t, '')
      this.setState({ QRCodeRefusedReason: new CantScanQRCode() })
    } else {
      t = bridge.editTransactionRecipient(account, t, recipient)
      if (QRCodeRefusedReason) this.setState({ QRCodeRefusedReason: null })
    }
    onChangeTransaction(t)
    return true
  }

  handleRecipientAddressHelp = () => {
    openURL(urls.recipientAddressInfo)
    track('Send Flow Recipient Address Help Requested')
  }
  render() {
    const { bridge, account, transaction, t, autoFocus } = this.props
    const { isValid, warning, QRCodeRefusedReason } = this.state
    const value = bridge.getTransactionRecipient(account, transaction)

    const error =
      !value || isValid
        ? QRCodeRefusedReason
        : warning || new InvalidAddress(null, { currencyName: account.currency.name })

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
