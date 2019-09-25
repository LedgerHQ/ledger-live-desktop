// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { TokenAccount, Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import AccountCardHeader from './Header'
import AccountCardBody from './Body'
import AccountContextMenu from '../../ContextMenu/AccountContextMenu'

const Card = styled(Box).attrs(() => ({
  bg: 'palette.background.paper',
  p: 3,
  boxShadow: 0,
  borderRadius: 1,
}))`
  cursor: pointer;
  border: 1px solid transparent;
  :hover {
    border-color: ${p => p.theme.colors.palette.divider};
  }
`

type Props = {
  hidden?: boolean,
  account: TokenAccount | Account,
  parentAccount: ?Account,
  onClick: (Account | TokenAccount, ?Account) => void,
  range: PortfolioRange,
}

class AccountCard extends PureComponent<Props> {
  onClick = () => {
    const { account, parentAccount, onClick } = this.props
    onClick(account, parentAccount)
  }

  render() {
    const { account, parentAccount, range, hidden, ...props } = this.props

    return (
      <AccountContextMenu account={account} parentAccount={parentAccount}>
        <Card
          {...props}
          style={{ display: hidden && 'none' }}
          p={20}
          onClick={this.onClick}
          data-e2e="dashboard_AccountCardWrapper"
        >
          <AccountCardHeader account={account} parentAccount={parentAccount} />
          <AccountCardBody account={account} parentAccount={parentAccount} range={range} />
        </Card>
      </AccountContextMenu>
    )
  }
}

export default AccountCard
