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

    let withPlaceholder = true

    const parsedAccounts = accounts
      .concat(Array(3 - (accounts.length % 3)).fill(null))
      .map((account, i) => {
        const item = {
          key: account ? account.id : `placeholder_${i}`,
          account,
          withPlaceholder,
        }

        if (!account && withPlaceholder) {
          withPlaceholder = !withPlaceholder
        }

        return item
      })

    return (
      <GridBox {...rest}>
        {parsedAccounts.map(
          item =>
            item.account ? (
              <AccountCard
                key={item.account.id}
                account={item.account}
                range={range}
                onClick={onAccountClick}
              />
            ) : (
              <AccountCardPlaceholder key={item.key} withPlaceholder={item.withPlaceholder} />
            ),
        )}
      </GridBox>
    )
  }
}

export default GridBody
