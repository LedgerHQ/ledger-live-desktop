// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import type { Account } from '@ledgerhq/live-common/lib/types/account'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import { GenericBox } from '../index'
import CryptoCurrencyIcon from '../../CryptoCurrencyIcon'
import Ellipsis from '../../base/Ellipsis'
import Balance from './Balance'
import Countervalue from './Countervalue'
import Delta from './Delta'
import AccountSyncStatusIndicator from '../AccountSyncStatusIndicator'

type Props = {
  account: Account,
  onClick: Account => void,
  range: PortfolioRange,
}

class AccountRowItem extends PureComponent<Props> {
  onClick = () => {
    const { account, onClick } = this.props
    onClick(account)
  }

  render() {
    const { account, range } = this.props
    return (
      <Box>
        <GenericBox flex={1} onClick={this.onClick}>
          <Box horizontal ff="Open Sans|SemiBold" flow={3} flex="30%" alignItems="center">
            <Box
              alignItems="center"
              justifyContent="center"
              style={{ color: account.currency.color }}
            >
              <CryptoCurrencyIcon currency={account.currency} size={20} />
            </Box>
            <Box grow>
              <Box style={{ textTransform: 'uppercase' }} fontSize={9} color="graphite">
                {account.currency.name}
              </Box>
              <Ellipsis fontSize={12} color="dark">
                {account.name}
              </Ellipsis>
            </Box>
          </Box>
          <Box flex="10%">
            <AccountSyncStatusIndicator accountId={account.id} account={account} />
          </Box>
          <Balance flex="35%" account={account} />
          <Countervalue flex="15%" account={account} range={range} />
          <Delta flex="1" account={account} range={range} />
        </GenericBox>
      </Box>
    )
  }
}

export default AccountRowItem
