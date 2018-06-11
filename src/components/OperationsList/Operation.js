// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { rgba } from 'styles/helpers'
import Box from 'components/base/Box'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import ConfirmationCell from './ConfirmationCell'
import DateCell from './DateCell'
import AccountCell from './AccountCell'
import AddressCell from './AddressCell'
import AmountCell from './AmountCell'

const OperationRow = styled(Box).attrs({
  horizontal: true,
  alignItems: 'center',
})`
  cursor: pointer;
  border-bottom: 1px solid ${p => p.theme.colors.lightGrey};
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
  account: Account,
  onOperationClick: (operation: Operation, account: Account) => void,
  t: T,
  withAccount: boolean,
}

class OperationComponent extends PureComponent<Props> {
  static defaultProps = {
    withAccount: false,
  }

  onOperationClick = () => {
    const { account, onOperationClick, operation } = this.props
    onOperationClick(operation, account)
  }

  render() {
    const { account, t, operation, withAccount } = this.props
    const isOptimistic = operation.blockHeight === null
    return (
      <OperationRow isOptimistic={isOptimistic} onClick={this.onOperationClick}>
        <ConfirmationCell operation={operation} account={account} t={t} />
        <DateCell operation={operation} t={t} />
        {withAccount &&
          account && <AccountCell accountName={account.name} currency={account.currency} />}
        <AddressCell operation={operation} />
        <AmountCell operation={operation} currency={account.currency} unit={account.unit} />
      </OperationRow>
    )
  }
}

export default OperationComponent
