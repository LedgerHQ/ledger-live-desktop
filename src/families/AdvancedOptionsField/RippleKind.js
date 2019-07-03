// @flow
import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import { translate } from 'react-i18next'

import type { Account } from '@ledgerhq/live-common/lib/types/account'
import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import { getAccountBridge } from '../../bridge'

type Props = {
  onChange: (*) => void,
  transaction: *,
  account: Account,
  t: *,
}

const uint32maxPlus1 = BigNumber(2).pow(32)

class RippleKind extends Component<Props> {
  onChange = str => {
    const { account, transaction, onChange } = this.props
    const bridge = getAccountBridge(account)
    const tag = BigNumber(str.replace(/[^0-9]/g, ''))
    if (!tag.isNaN() && tag.isFinite()) {
      if (tag.isInteger() && tag.isPositive() && tag.lt(uint32maxPlus1)) {
        onChange(bridge.editTransactionExtra(account, transaction, 'tag', tag.toNumber()))
      }
    } else {
      onChange(bridge.editTransactionExtra(account, transaction, 'tag', undefined))
    }
  }

  render() {
    const { account, transaction, t } = this.props
    const bridge = getAccountBridge(account)
    const tag = bridge.getTransactionExtra(account, transaction, 'tag')

    return (
      <Box vertical flow={5}>
        <Box grow>
          <Label>
            <span>{t('send.steps.amount.rippleTag')}</span>
          </Label>
          <Input ff="Rubik" value={String(tag || '')} onChange={this.onChange} />
        </Box>
      </Box>
    )
  }
}

export default translate()(RippleKind)
