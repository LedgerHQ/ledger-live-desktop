// @flow

import React, { PureComponent } from 'react'
import type { TokenAccount, Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import AccountItem from '../AccountRowItem'
import AccountItemPlaceholder from '../AccountRowItem/Placeholder'

type Props = {
  visibleAccounts: Account[],
  hiddenAccounts: Account[],
  onAccountClick: (Account | TokenAccount) => void,
  lookupParentAccount: (id: string) => ?Account,
  range: PortfolioRange,
  showNewAccount: boolean,
  search?: string,
}

class ListBody extends PureComponent<Props> {
  render() {
    const {
      visibleAccounts,
      showNewAccount,
      hiddenAccounts,
      range,
      onAccountClick,
      lookupParentAccount,
      search,
    } = this.props
    return (
      <Box>
        {visibleAccounts.map(account => (
          <AccountItem
            key={account.id}
            account={account}
            search={search}
            parentAccount={
              account.type !== 'Account' ? lookupParentAccount(account.parentId) : null
            }
            range={range}
            onClick={onAccountClick}
          />
        ))}
        {showNewAccount ? <AccountItemPlaceholder /> : null}
        {hiddenAccounts.map(account => (
          <AccountItem
            hidden
            key={account.id}
            account={account}
            search={search}
            parentAccount={
              account.type !== 'Account' ? lookupParentAccount(account.parentId) : null
            }
            range={range}
            onClick={onAccountClick}
          />
        ))}
      </Box>
    )
  }
}

export default ListBody
