// @flow

import React, { PureComponent } from 'react'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import AccountItem from '../AccountRowItem'
import AccountItemPlaceholder from '../AccountRowItem/Placeholder'

type Props = {
  accounts: Account[],
  onAccountClick: Account => void,
  range: PortfolioRange,
}

class ListBody extends PureComponent<Props> {
  render() {
    const { accounts, range, onAccountClick } = this.props
    return (
      <Box>
        {accounts.map(item => (
          <AccountItem key={item.id} account={item} range={range} onClick={onAccountClick} />
        ))}
        <AccountItemPlaceholder />
      </Box>
    )
  }
}

export default ListBody
