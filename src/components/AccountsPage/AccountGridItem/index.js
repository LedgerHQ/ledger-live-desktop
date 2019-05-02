// @flow

import React, { PureComponent } from 'react'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Bar from 'components/base/Bar'
import Box, { Card } from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import AccountCardHeader from './Header'
import AccountCardBody from './Body'

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
    const { account, range, ...props } = this.props
    return (
      <Box>
        <Card {...props} p={20} onClick={this.onClick} data-e2e="dashboard_AccountCardWrapper">
          <Box flow={4}>
            <AccountCardHeader account={account} />
            <Bar size={1} color="fog" />
            <Box justifyContent="center">
              <FormattedVal
                alwaysShowSign={false}
                animateTicker={false}
                ellipsis
                color="dark"
                unit={account.unit}
                showCode
                val={account.balance}
              />
            </Box>
          </Box>
          <AccountCardBody account={account} range={range} />
        </Card>
      </Box>
    )
  }
}

export default AccountCard
