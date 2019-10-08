// @flow

import React, { PureComponent } from 'react'
import type { Account, TokenAccount, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import styled from 'styled-components'
import AccountCardPlaceholder from '../AccountGridItem/Placeholder'
import AccountCard from '../AccountGridItem'

type Props = {
  visibleAccounts: (Account | TokenAccount)[],
  hiddenAccounts: (Account | TokenAccount)[],
  onAccountClick: (Account | TokenAccount) => void,
  lookupParentAccount: (id: string) => ?Account,
  range: PortfolioRange,
  showNewAccount: boolean,
}

const GridBox = styled(Box)`
  margin-top: 18px;
  display: grid;
  grid-gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
`

class GridBody extends PureComponent<Props> {
  render() {
    const {
      visibleAccounts,
      hiddenAccounts,
      range,
      showNewAccount,
      onAccountClick,
      lookupParentAccount,
      ...rest
    } = this.props

    return (
      <GridBox {...rest}>
        {visibleAccounts.map(account => (
          <AccountCard
            key={account.id}
            account={account}
            parentAccount={
              account.type !== 'Account' ? lookupParentAccount(account.parentId) : null
            }
            range={range}
            onClick={onAccountClick}
          />
        ))}
        {showNewAccount ? <AccountCardPlaceholder key="placeholder" /> : null}
        {hiddenAccounts.map(account => (
          <AccountCard
            hidden
            key={account.id}
            account={account}
            parentAccount={
              account.type !== 'Account' ? lookupParentAccount(account.parentId) : null
            }
            range={range}
            onClick={onAccountClick}
          />
        ))}
      </GridBox>
    )
  }
}

export default GridBody
