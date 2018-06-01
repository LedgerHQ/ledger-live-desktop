// @flow
import React, { Component } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import type { WalletBridge } from 'bridge/types'
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
    this.unmount = true
  }
  unmount = false
  async resync() {
    const { account, bridge, transaction } = this.props
    const isValid = await bridge.isRecipientValid(
      account.currency,
      bridge.getTransactionRecipient(account, transaction),
    )
    if (this.unmount) return
    this.setState({ isValid })
  }

  render() {
    const { bridge, account, transaction, onChangeTransaction, t } = this.props
    const { isValid } = this.state
    const value = bridge.getTransactionRecipient(account, transaction)
    return (
      <Box flow={1}>
        <Label>
          <span>{t('send:steps.amount.recipientAddress')}</span>
          <LabelInfoTooltip ml={1} text={t('send:steps.amount.recipientAddress')} />
        </Label>
        <RecipientAddress
          withQrCode
          error={!value || isValid ? null : `This is not a valid ${account.currency.name} address`}
          value={value}
          onChange={(recipient, maybeExtra) => {
            const { amount, currency } = maybeExtra || {}
            if (currency && currency.scheme !== account.currency.scheme) return false
            let t = transaction
            if (amount) {
              t = bridge.editTransactionAmount(account, t, amount)
            }
            t = bridge.editTransactionRecipient(account, t, recipient)
            onChangeTransaction(t)
            return true
          }}
        />
      </Box>
    )
  }
}

export default RecipientField
