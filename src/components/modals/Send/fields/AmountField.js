// @flow
import React, { Component } from 'react'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import RequestAmount from 'components/RequestAmount'

class AmountField extends Component<*, { canBeSpentError: ?Error }> {
  state = {
    canBeSpentError: null,
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
      await bridge.checkCanBeSpent(account, transaction)
      if (this.syncId !== syncId) return
      this.setState({ canBeSpentError: null })
    } catch (canBeSpentError) {
      this.setState({ canBeSpentError })
    }
  }

  onChange = (amount: number) => {
    const { bridge, account, transaction, onChangeTransaction } = this.props
    onChangeTransaction(bridge.editTransactionAmount(account, transaction, amount))
  }

  render() {
    const { bridge, account, transaction, t } = this.props
    const { canBeSpentError } = this.state
    return (
      <Box flow={1}>
        <Label>{t('app:send.steps.amount.amount')}</Label>
        <RequestAmount
          withMax={false}
          account={account}
          canBeSpentError={canBeSpentError}
          onChange={this.onChange}
          value={bridge.getTransactionAmount(account, transaction)}
        />
      </Box>
    )
  }
}

export default AmountField
