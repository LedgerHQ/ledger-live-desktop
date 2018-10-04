// @flow
import React, { Component } from 'react'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import RequestAmount from 'components/RequestAmount'

// list of errors that are handled somewhere else on UI, otherwise the field will catch every other errors.
const blacklistErrorName = ['FeeNotLoaded', 'InvalidAddress']

class AmountField extends Component<*, { validTransactionError: ?Error }> {
  state = {
    validTransactionError: null,
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
    const { account, bridge, transaction } = this.props
    const syncId = ++this.syncId
    try {
      await bridge.checkValidTransaction(account, transaction)
      if (this.syncId !== syncId) return
      this.setState({ validTransactionError: null })
    } catch (validTransactionError) {
      this.setState({ validTransactionError })
    }
  }

  onChange = (amount: number) => {
    const { bridge, account, transaction, onChangeTransaction } = this.props
    onChangeTransaction(bridge.editTransactionAmount(account, transaction, amount))
  }

  render() {
    const { bridge, account, transaction, t } = this.props
    const { validTransactionError } = this.state
    return (
      <Box flow={1}>
        <Label>{t('send.steps.amount.amount')}</Label>
        <RequestAmount
          withMax={false}
          account={account}
          validTransactionError={
            validTransactionError && blacklistErrorName.includes(validTransactionError.name)
              ? null
              : validTransactionError
          }
          onChange={this.onChange}
          value={bridge.getTransactionAmount(account, transaction)}
        />
      </Box>
    )
  }
}

export default AmountField
