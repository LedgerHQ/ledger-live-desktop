// @flow
import React, { PureComponent } from 'react'
import { BigNumber } from 'bignumber.js'
import { translate } from 'react-i18next'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { getAccountBridge } from 'bridge'
import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'

type Props = {
  onChange: (*) => void,
  transaction: *,
  account: Account,
  t: *,
}

class AdvancedOptions extends PureComponent<Props, *> {
  state = { isValid: false }

  componentDidMount() {
    this.resync()
  }

  componentDidUpdate(nextProps: Props) {
    if (nextProps.transaction !== this.props.transaction) {
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
    const syncId = ++this.syncId
    const { account, transaction } = this.props
    const bridge = getAccountBridge(account)
    const recipient = bridge.getTransactionRecipient(account, transaction)
    const isValid = await bridge
      .checkValidRecipient(account, recipient)
      .then(() => true, () => false)
    if (syncId !== this.syncId) return
    if (this.isUnmounted) return
    this.setState(s => (s.isValid !== isValid ? { isValid } : null))
    if (isValid) {
      const t = await bridge.prepareTransaction(account, transaction)
      if (syncId !== this.syncId) return
      if (t !== transaction) this.props.onChange(t)
    }
  }

  onChange = (str: string) => {
    const { account, transaction, onChange } = this.props
    const bridge = getAccountBridge(account)
    let gasLimit = BigNumber(str || 0)
    if (gasLimit.isNaN() || !gasLimit.isFinite()) {
      gasLimit = BigNumber(0x5208)
    }
    onChange(bridge.editTransactionExtra(account, transaction, 'gasLimit', gasLimit))
  }

  render() {
    const { account, transaction, t } = this.props
    const { isValid } = this.state
    const bridge = getAccountBridge(account)
    const gasLimit = bridge.getTransactionExtra(account, transaction, 'gasLimit')
    return (
      <Box horizontal align="center" flow={5}>
        <Box style={{ width: 200 }}>
          <Label>
            <span>{t('send.steps.amount.ethereumGasLimit')}</span>
          </Label>
        </Box>
        <Box grow>
          <Input
            value={gasLimit ? gasLimit.toString() : ''}
            onChange={this.onChange}
            loading={isValid && !gasLimit}
          />
        </Box>
      </Box>
    )
  }
}

export default translate()(AdvancedOptions)
