// @flow

import React, { PureComponent } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types/account'
import Box from 'components/base/Box'
import Ellipsis from 'components/base/Ellipsis'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import AccountSyncStatusIndicator from '../AccountSyncStatusIndicator'

class Header extends PureComponent<{
  account: Account,
}> {
  render() {
    const { account } = this.props
    return (
      <Box horizontal ff="Open Sans|SemiBold" flow={3} alignItems="center">
        <Box alignItems="center" justifyContent="center" style={{ color: account.currency.color }}>
          <CryptoCurrencyIcon currency={account.currency} size={20} />
        </Box>
        <Box grow>
          <Box style={{ textTransform: 'uppercase' }} fontSize={10} color="graphite">
            {account.currency.name}
          </Box>
          <Ellipsis fontSize={13} color="dark">
            {account.name}
          </Ellipsis>
        </Box>
        <Box>
          <AccountSyncStatusIndicator accountId={account.id} account={account} />
        </Box>
      </Box>
    )
  }
}

export default Header
