// @flow
import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import { translate } from 'react-i18next'
import type { Account, Transaction } from '@ledgerhq/live-common/lib/types'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'

type Props = {
  onChange: Transaction => void,
  transaction: Transaction,
  account: Account,
  t: *,
}

const uint32maxPlus1 = BigNumber(2).pow(32)

class RippleKind extends Component<Props> {
  onChange = str => {
    const { account, transaction, onChange } = this.props
    const bridge = getAccountBridge(account)
    const tag = BigNumber(str.replace(/[^0-9]/g, ''))
    const patch = {
      tag:
        !tag.isNaN() &&
        tag.isFinite() &&
        tag.isInteger() &&
        tag.isPositive() &&
        tag.lt(uint32maxPlus1)
          ? tag.toNumber()
          : undefined,
    }
    onChange(bridge.updateTransaction(transaction, patch))
  }

  render() {
    const { transaction, t } = this.props
    return (
      <Box vertical flow={5}>
        <Box grow>
          <Label>
            <span>{t('send.steps.amount.rippleTag')}</span>
          </Label>
          <Input ff="Rubik" value={String(transaction.tag || '')} onChange={this.onChange} />
        </Box>
      </Box>
    )
  }
}

export default translate()(RippleKind)
