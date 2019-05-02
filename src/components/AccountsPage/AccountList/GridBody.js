// @flow

import React, { PureComponent } from 'react'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import styled from 'styled-components'
import AccountCardPlaceholder from '../AccountGridItem/Placeholder'
import AccountCard from '../AccountGridItem'

type Props = {
  accounts: Account[],
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
    const { accounts, range, onAccountClick, ...rest } = this.props

    return (
      <GridBox {...rest}>
        {accounts.map(account => (
          <AccountCard key={account.id} account={account} range={range} onClick={onAccountClick} />
        ))}
        <AccountCardPlaceholder key={'placeholder'} />
      </GridBox>
    )
  }
}

export default GridBody
