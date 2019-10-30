// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { createStructuredSelector } from 'reselect'
import type { TokenAccount, Account, Operation } from '@ledgerhq/live-common/lib/types'
import { getMainAccount } from '@ledgerhq/live-common/lib/account'
import { getOperationAmountNumber } from '@ledgerhq/live-common/lib/operation'
import type { T } from 'types/common'
import { confirmationsNbForCurrencySelector, marketIndicatorSelector } from 'reducers/settings'
import { getMarketColor } from 'styles/helpers'

import Box from 'components/base/Box'

import ConfirmationCheck from './ConfirmationCheck'

const mapStateToProps = createStructuredSelector({
  confirmationsNb: (state, { account, parentAccount }) =>
    confirmationsNbForCurrencySelector(state, {
      currency: getMainAccount(account, parentAccount).currency,
    }),
  marketIndicator: marketIndicatorSelector,
})

const Cell = styled(Box).attrs(() => ({
  px: 4,
  horizontal: true,
  alignItems: 'center',
}))`
  width: 44px;
`

type Props = {
  account: Account | TokenAccount,
  parentAccount?: Account,
  confirmationsNb: number,
  marketIndicator: string,
  t: T,
  operation: Operation,
}

class ConfirmationCell extends PureComponent<Props> {
  render() {
    const { account, parentAccount, confirmationsNb, t, operation, marketIndicator } = this.props
    const mainAccount = getMainAccount(account, parentAccount)

    const amount = getOperationAmountNumber(operation)

    const isNegative = amount.isNegative()

    const isConfirmed =
      (operation.blockHeight ? mainAccount.blockHeight - operation.blockHeight : 0) >
      confirmationsNb

    const marketColor = getMarketColor({
      marketIndicator,
      isNegative,
    })

    return (
      <Cell align="center" justify="flex-start">
        <ConfirmationCheck
          type={operation.type}
          isConfirmed={isConfirmed}
          marketColor={marketColor}
          hasFailed={operation.hasFailed}
          t={t}
        />
      </Cell>
    )
  }
}

export default connect(mapStateToProps)(ConfirmationCell)
