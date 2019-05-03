// @flow

import React, { PureComponent } from 'react'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import AccountItem from '../AccountRowItem'
import AccountItemPlaceholder from '../AccountRowItem/Placeholder'

type Props = {
  visibleAccounts: Account[],
  hiddenAccounts: Account[],
  onAccountClick: Account => void,
  range: PortfolioRange,
}

class ListBody extends PureComponent<Props> {
  render() {
    const { visibleAccounts, hiddenAccounts, range, onAccountClick } = this.props
    return (
      <Box>
        {visibleAccounts.map(item => (
          <AccountItem key={item.id} account={item} range={range} onClick={onAccountClick} />
        ))}
        <AccountItemPlaceholder />
        {hiddenAccounts.map(item => (
          <AccountItem hidden key={item.id} account={item} range={range} onClick={onAccountClick} />
        ))}
      </Box>
    )
  }
}

export default ListBody
