// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { rgba } from 'styles/helpers'
import Box from 'components/base/Box'
import type { TokenAccount, Account, Operation } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import ConfirmationCell from './ConfirmationCell'
import DateCell from './DateCell'
import AccountCell from './AccountCell'
import AddressCell from './AddressCell'
import AmountCell from './AmountCell'

const OperationRow = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: 'center',
}))`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  height: 68px;
  opacity: ${p => (p.isOptimistic ? 0.5 : 1)};

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`

type Props = {
  operation: Operation,
  account: Account | TokenAccount,
  parentAccount?: Account,
  onOperationClick: (
    operation: Operation,
    account: Account | TokenAccount,
    parentAccount?: Account,
  ) => void,
  t: T,
  withAccount: boolean,
  compact?: boolean,
  text?: string,
}

class OperationComponent extends PureComponent<Props> {
  static defaultProps = {
    withAccount: false,
  }

  onOperationClick = () => {
    const { account, parentAccount, onOperationClick, operation } = this.props
    onOperationClick(operation, account, parentAccount)
  }

  render() {
    const { account, parentAccount, t, operation, withAccount, compact, text } = this.props
    const isOptimistic = operation.blockHeight === null
    return (
      <OperationRow isOptimistic={isOptimistic} onClick={this.onOperationClick}>
        <ConfirmationCell
          operation={operation}
          parentAccount={parentAccount}
          account={account}
          t={t}
        />
        <DateCell compact={compact} text={text} operation={operation} t={t} />
        {withAccount &&
          (account.type === 'Account' ? (
            <AccountCell accountName={account.name} currency={account.currency} />
          ) : (
            <AccountCell accountName={account.token.name} currency={account.token} />
          ))}
        <AddressCell operation={operation} />
        {account.type === 'Account' ? (
          <AmountCell operation={operation} currency={account.currency} unit={account.unit} />
        ) : (
          <AmountCell
            operation={operation}
            currency={account.token}
            unit={account.token.units[0]}
          />
        )}
      </OperationRow>
    )
  }
}

export default OperationComponent
