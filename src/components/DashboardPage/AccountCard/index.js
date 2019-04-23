// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Bar from 'components/base/Bar'
import Box, { Card } from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import AccountCardHeader from './Header'
import AccountCardBody from './Body'

const Wrapper = styled(Card).attrs({
  p: 4,
  flex: 1,
})`
  cursor: ${p => (p.onClick ? 'pointer' : 'default')};
`

class AccountCard extends PureComponent<{
  account: Account,
  onClick: Account => void,
  range: PortfolioRange,
}> {
  onClick = () => {
    const { account, onClick } = this.props
    onClick(account)
  }
  render() {
    const { account, onClick, range, ...props } = this.props
    return (
      <Wrapper onClick={this.onClick} {...props} data-e2e="dashboard_AccountCardWrapper">
        <Box flow={4}>
          <AccountCardHeader accountName={account.name} currency={account.currency} />
          <Bar size={1} color="fog" />
          <Box justifyContent="center">
            <FormattedVal
              alwaysShowSign={false}
              color="dark"
              unit={account.unit}
              showCode
              val={account.balance}
              maxLength={18}
            />
          </Box>
        </Box>
        <AccountCardBody account={account} range={range} />
      </Wrapper>
    )
  }
}

export default AccountCard
