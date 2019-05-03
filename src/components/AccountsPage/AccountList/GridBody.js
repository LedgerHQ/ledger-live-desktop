// @flow

import React, { PureComponent } from 'react'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import styled from 'styled-components'
import AccountCardPlaceholder from '../AccountGridItem/Placeholder'
import AccountCard from '../AccountGridItem'

type Props = {
  visibleAccounts: Account[],
  hiddenAccounts: Account[],
  onAccountClick: Account => void,
  range: PortfolioRange,
}

const GridBox = styled(Box)`
  display: grid;
  grid-gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`

class GridBody extends PureComponent<Props> {
  render() {
    const { visibleAccounts, hiddenAccounts, range, onAccountClick, ...rest } = this.props

    return (
      <GridBox {...rest}>
        {visibleAccounts.map(account => (
          <AccountCard key={account.id} account={account} range={range} onClick={onAccountClick} />
        ))}
        <AccountCardPlaceholder key="placeholder" />
        {hiddenAccounts.map(account => (
          <AccountCard
            hidden
            key={account.id}
            account={account}
            range={range}
            onClick={onAccountClick}
          />
        ))}
      </GridBox>
    )
  }
}

export default GridBody
