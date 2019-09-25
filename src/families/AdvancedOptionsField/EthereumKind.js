// @flow
import invariant from 'invariant'
import React, { PureComponent } from 'react'
import { BigNumber } from 'bignumber.js'
import { translate } from 'react-i18next'
import type { Account, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import type { Transaction } from '@ledgerhq/live-common/lib/families/ethereum/types'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'

type Props = {
  onChange: Transaction => void,
  transaction: Transaction,
  account: Account,
  status: TransactionStatus,
  t: *,
}

class AdvancedOptions extends PureComponent<Props, *> {
  onChange = (str: string) => {
    const { account, transaction, onChange } = this.props
    const bridge = getAccountBridge(account)
    let gasLimit = BigNumber(str || 0)
    if (gasLimit.isNaN() || !gasLimit.isFinite()) {
      gasLimit = BigNumber(0x5208)
    }
    onChange(bridge.updateTransaction(transaction, { gasLimit }))
  }

  render() {
    const { transaction, status, t } = this.props
    invariant(transaction.family === 'ethereum', 'AdvancedOptions: ethereum family expected')
    const gasLimit = transaction.gasLimit
    const isValid = !!status.recipientError
    return (
      <Box horizontal align="center" flow={5}>
        <Box style={{ width: 200 }}>
          <Label>
            <span>{t('send.steps.amount.ethereumGasLimit')}</span>
          </Label>
        </Box>
        <Box grow>
          <Input
            ff="Rubik"
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
