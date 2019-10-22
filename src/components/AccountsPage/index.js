// @flow

import React, { PureComponent, Fragment } from 'react'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import { connect } from 'react-redux'
import { createSelector, createStructuredSelector } from 'reselect'
import { push } from 'react-router-redux'
import styled from 'styled-components'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import { flattenSortAccountsEnforceHideEmptyTokenSelector } from 'actions/general'
import UpdateBanner from 'components/Updater/Banner'
import AccountsHeader from './AccountsHeader'
import AccountList from './AccountList'
import { accountsSelector } from '../../reducers/accounts'
import { setAccountsViewMode, setSelectedTimeRange } from '../../actions/settings'
import { accountsViewModeSelector, selectedTimeRangeSelector } from '../../reducers/settings'
import EmptyState from './EmptyState'
import { TopBannerContainer } from '../DashboardPage'
import MigrationBanner from '../modals/MigrateAccounts/Banner'

type Props = {
  accounts: (Account | TokenAccount)[],
  push: Function,
  range: PortfolioRange,
  mode: *,
  setAccountsViewMode: (*) => void,
  setSelectedTimeRange: PortfolioRange => void,
}

const accountsOrFlattenAccountsSelector = createSelector(
  accountsViewModeSelector,
  accountsSelector,
  flattenSortAccountsEnforceHideEmptyTokenSelector,
  (mode, accounts, flattenedAccounts) => (mode === 'card' ? flattenedAccounts : accounts),
)

const mapStateToProps = createStructuredSelector({
  accounts: accountsOrFlattenAccountsSelector,
  mode: accountsViewModeSelector,
  range: selectedTimeRangeSelector,
})

const mapDispatchToProps = {
  push,
  setAccountsViewMode,
  setSelectedTimeRange,
}

export const GenericBox = styled(Box)`
  background: ${p => p.theme.colors.palette.background.paper};
  flex: 1;
  padding: 10px 20px;
  margin-bottom: 9px;
  color: #abadb6;
  font-weight: 600;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 #00000007;
`

class AccountsPage extends PureComponent<Props> {
  onAccountClick = (account: Account | TokenAccount, parentAccount: ?Account) =>
    parentAccount
      ? this.props.push(`/account/${parentAccount.id}/${account.id}`)
      : this.props.push(`/account/${account.id}`)

  render() {
    const { accounts, mode, setAccountsViewMode, setSelectedTimeRange, range } = this.props
    if (accounts.length === 0) {
      return (
        <Fragment>
          <TrackPage category="Accounts" accountsLength={accounts.length} />
          <TopBannerContainer>
            <UpdateBanner />
            <MigrationBanner />
          </TopBannerContainer>
          <EmptyState />
        </Fragment>
      )
    }
    return (
      <Box>
        <TrackPage category="Accounts" accountsLength={accounts.length} />
        <TopBannerContainer>
          <MigrationBanner />
        </TopBannerContainer>
        <AccountsHeader />
        <AccountList
          onAccountClick={this.onAccountClick}
          onRangeChange={setSelectedTimeRange}
          onModeChange={setAccountsViewMode}
          accounts={accounts}
          range={range}
          mode={mode}
        />
      </Box>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountsPage)
