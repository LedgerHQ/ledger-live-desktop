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
    this.unmount = true
  }
  unmount = false
  async resync() {
    const { account, bridge, transaction } = this.props
    const canBeSpent = await bridge.canBeSpent(account, transaction)
    if (this.unmount) return
    this.setState({ canBeSpent })
  }

  render() {
    const { bridge, account, transaction, onChangeTransaction, t } = this.props
    const { canBeSpent } = this.state
    return (
      <Box flow={1}>
        <Label>{t('send:steps.amount.amount')}</Label>
        <RequestAmount
          withMax={false}
          account={account}
          canBeSpent={canBeSpent}
          onChange={amount =>
            onChangeTransaction(bridge.editTransactionAmount(account, transaction, amount))
          }
          value={bridge.getTransactionAmount(account, transaction)}
        />
      </Box>
    )
  }
}

export default AmountField
