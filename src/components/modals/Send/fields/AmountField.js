// @flow
import React, { Component } from 'react'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import RequestAmount from 'components/RequestAmount'

class AmountField extends Component<*, { canBeSpent: boolean }> {
  state = {
    canBeSpent: true,
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
    const canBeSpent = await bridge.canBeSpent(account, transaction)
    if (this.syncId !== syncId) return
    this.setState({ canBeSpent })
  }

  onChange = (amount: number) => {
    const { bridge, account, transaction, onChangeTransaction } = this.props
    onChangeTransaction(bridge.editTransactionAmount(account, transaction, amount))
  }

  render() {
    const { bridge, account, transaction, t } = this.props
    const { canBeSpent } = this.state
    return (
      <Box flow={1}>
        <Label>{t('app:send.steps.amount.amount')}</Label>
        <RequestAmount
          withMax={false}
          account={account}
          canBeSpent={canBeSpent}
          onChange={this.onChange}
          value={bridge.getTransactionAmount(account, transaction)}
        />
      </Box>
    )
  }
}

export default AmountField
