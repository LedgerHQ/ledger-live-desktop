// @flow

import React, { PureComponent, Fragment } from 'react'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { push } from 'react-router-redux'
import styled from 'styled-components'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import UpdateBanner from 'components/Updater/Banner'
import AccountsHeader from './AccountsHeader'
import AccountList from './AccountList'
import { accountsSelector } from '../../reducers/accounts'
import { setAccountsViewMode, setSelectedTimeRange } from '../../actions/settings'
import { accountsViewModeSelector, selectedTimeRangeSelector } from '../../reducers/settings'
import EmptyState from './EmptyState'
import { Dismiss as NewAccountsDismiss } from '../news/NewAccountsPage'
import { TopBannerContainer } from '../DashboardPage'

type Props = {
  accounts: Account[],
  push: Function,
  range: PortfolioRange,
  mode: *,
  setAccountsViewMode: (*) => void,
  setSelectedTimeRange: PortfolioRange => void,
}

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  mode: accountsViewModeSelector,
  range: selectedTimeRangeSelector,
})

const mapDispatchToProps = {
  push,
  setAccountsViewMode,
  setSelectedTimeRange,
}

export const GenericBox = styled(Box)`
  background: #ffffff;
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
  onAccountClick = account => this.props.push(`/account/${account.id}`)

  render() {
    const { accounts, mode, setAccountsViewMode, setSelectedTimeRange, range } = this.props
    if (accounts.length === 0) {
      return (
        <Fragment>
          <TrackPage category="Accounts" accountsLength={accounts.length} />
          <TopBannerContainer>
            <UpdateBanner />
          </TopBannerContainer>
          <NewAccountsDismiss />
          <EmptyState />
        </Fragment>
      )
    }
    return (
      <Box>
        <NewAccountsDismiss />
        <TrackPage category="Accounts" accountsLength={accounts.length} />
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
