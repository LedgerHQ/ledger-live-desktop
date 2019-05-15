// @flow
import React, { PureComponent } from 'react'
import { BigNumber } from 'bignumber.js'
import { translate } from 'react-i18next'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { WalletBridge } from 'bridge/types'
import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import Spoiler from 'components/base/Spoiler'

type Props = {
  onChange: (*) => void,
  value: *,
  account: Account,
  bridge: WalletBridge<*>,
  t: *,
}

class AdvancedOptions extends PureComponent<Props, *> {
  state = {
    loading: false,
  }

  componentDidMount() {
    this.resync()
  }

  componentDidUpdate(nextProps: Props) {
    if (nextProps.value !== this.props.value) {
      this.resync()
    }
  }
  componentWillUnmount() {
    this.syncId++
    this.isUnmounted = true
  }

  lastRecipient = this.props.value.recipient
  isUnmounted = false
  syncId = 0
  async resync() {
    const { bridge, account, value, onChange } = this.props
    const syncId = ++this.syncId
    const recipient = bridge.getTransactionRecipient(account, value)
    if (recipient === this.lastRecipient) return
    const isValid = await bridge.isRecipientValid(account, recipient)
    if (syncId !== this.syncId) return
    if (this.isUnmounted) return
    if (isValid && bridge.estimateGasLimit) {
      const { estimateGasLimit } = bridge
      let gasLimit
      try {
        this.setState({ loading: true })
        gasLimit = await estimateGasLimit(account, recipient)
      } finally {
        if (!this.isUnmounted) this.setState({ loading: false })
      }
      if (syncId !== this.syncId) return
      if (this.isUnmounted) return
      this.lastRecipient = recipient
      onChange({
        ...this.props.value,
        gasLimit: BigNumber(gasLimit),
      })
    }
  }

  onChange = (str: string) => {
    const { onChange, value } = this.props
    let gasLimit = BigNumber(str || 0)
    if (gasLimit.isNaN() || !gasLimit.isFinite()) {
      gasLimit = BigNumber(0x5208)
    }
    onChange({ ...value, gasLimit })
  }

  render() {
    const { value, t } = this.props
    const { loading } = this.state
    return (
      <Spoiler title={t('send.steps.amount.advancedOptions')}>
        <Box horizontal align="center" flow={5}>
          <Box style={{ width: 200 }}>
            <Label>
              <span>{t('send.steps.amount.ethereumGasLimit')}</span>
            </Label>
          </Box>
          <Box grow>
            <Input value={value.gasLimit} onChange={this.onChange} loading={loading} />
          </Box>
        </Box>
      </Spoiler>
    )
  }
}

export default translate()(AdvancedOptions)
