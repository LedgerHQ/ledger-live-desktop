// @flow
import React, { Component } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import type { WalletBridge } from 'bridge/types'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'
import Box from 'components/base/Box'
import SelectAccount from 'components/SelectAccount'
import Label, { InteractiveLabel } from 'components/base/Label'
import IconExternalLink from 'icons/ExternalLink'
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

type State = {
  isValid: boolean,
  warning: ?Error,
  QRCodeRefusedReason: ?Error,

  // whether or not recipient is from accounts list
  isChoosingAccount: boolean,

  // currently selected account
  selectedAccount: ?Account,

  // internal field to manage focus after going back from "accounts list" mode
  shouldFocus: boolean,
}

const InvalidAddress = createCustomErrorClass('InvalidAddress')

class RecipientField<Transaction> extends Component<Props<Transaction>, State> {
  state = {
    isValid: true,
    warning: null,
    QRCodeRefusedReason: null,
    isChoosingAccount: false,
    shouldFocus: false,
    selectedAccount: null,
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
    const isValid = await bridge.isRecipientValid(account, recipient)
    const warning = await bridge.getRecipientWarning(account, recipient)
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
    const warning = fromQRCode ? await bridge.getRecipientWarning(account, recipient) : null
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

  handleChooseAccount = (selectedAccount: ?Account) => {
    if (!selectedAccount) return
    const { bridge, account, transaction, onChangeTransaction } = this.props
    this.setState({ selectedAccount })
    const t = bridge.editTransactionRecipient(account, transaction, selectedAccount.freshAddress)
    onChangeTransaction(t)
  }

  toggleChooseAccount = () => {
    const { bridge, account, transaction, onChangeTransaction } = this.props
    this.setState(({ isChoosingAccount }) => ({
      isChoosingAccount: !isChoosingAccount,
      shouldFocus: isChoosingAccount,
      selectedAccount: null,
    }))
    const t = bridge.editTransactionRecipient(account, transaction, '')
    onChangeTransaction(t)
  }

  accountsFilter = (acc: Account) => acc.currency === this.props.account.currency

  render() {
    const { bridge, account, transaction, t, autoFocus } = this.props
    const {
      isValid,
      warning,
      QRCodeRefusedReason,
      isChoosingAccount,
      selectedAccount,
      shouldFocus,
    } = this.state
    const value = bridge.getTransactionRecipient(account, transaction)

    const error =
      !value || isValid
        ? QRCodeRefusedReason
        : warning || new InvalidAddress(null, { currencyName: account.currency.name })

    const actionLabel = isChoosingAccount
      ? t('send.steps.amount.useAddress')
      : t('send.steps.amount.useAccount')

    return (
      <Box flow={1}>
        {isChoosingAccount ? (
          <Label>{t('send.steps.amount.recipientAccount')}</Label>
        ) : (
          <InteractiveLabel
            Icon={IconExternalLink}
            onClick={this.handleRecipientAddressHelp}
            label={t('send.steps.amount.recipientAddress')}
          />
        )}
        {isChoosingAccount ? (
          <SelectAccount
            filter={this.accountsFilter}
            openMenuOnFocus
            autoFocus
            onChange={this.handleChooseAccount}
            value={selectedAccount}
          />
        ) : (
          <RecipientAddress
            autoFocus={autoFocus || shouldFocus}
            withQrCode
            error={error}
            warning={warning}
            value={value}
            onChange={this.onChange}
          />
        )}
        <Box align="flex-end">
          <InteractiveLabel onClick={this.toggleChooseAccount} label={actionLabel} />
        </Box>
      </Box>
    )
  }
}

export default RecipientField
