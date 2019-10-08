// @flow

import React, { PureComponent, Fragment } from 'react'
import uniq from 'lodash/uniq'
import { Redirect } from 'react-router'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { createStructuredSelector } from 'reselect'
import type { Account, Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import { colors } from 'styles/theme'

import { accountsSelector } from 'reducers/accounts'
import { counterValueCurrencySelector, selectedTimeRangeSelector } from 'reducers/settings'
import type { TimeRange } from 'reducers/settings'

import { saveSettings } from 'actions/settings'

import TrackPage from 'analytics/TrackPage'
import RefreshAccountsOrdering from 'components/RefreshAccountsOrdering'
import UpdateBanner from 'components/Updater/Banner'
import BalanceInfos from 'components/BalanceInfos'
import Box from 'components/base/Box'
import OperationsList from 'components/OperationsList'
import StickyBackToTop from 'components/StickyBackToTop'
import styled from 'styled-components'
import BalanceSummary from './BalanceSummary'
import AssetDistribution from '../AssetDistribution'
import MigrationBanner from '../modals/MigrateAccounts/Banner'

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  counterValue: counterValueCurrencySelector,
  selectedTimeRange: selectedTimeRangeSelector,
})

const mapDispatchToProps = {
  push,
  saveSettings,
}

type Props = {
  t: T,
  accounts: Account[],
  push: Function,
  counterValue: Currency,
  selectedTimeRange: TimeRange,
  saveSettings: ({ selectedTimeRange: TimeRange }) => *,
}

class DashboardPage extends PureComponent<Props> {
  onAccountClick = account => this.props.push(`/account/${account.id}`)

  handleChangeSelectedTime = item => {
    this.props.saveSettings({ selectedTimeRange: item.key })
  }

  Header = ({ portfolio }) => (
    <BalanceInfos
      t={this.props.t}
      unit={this.props.counterValue.units[0]}
      isAvailable={portfolio.balanceAvailable}
      since={this.props.selectedTimeRange}
      valueChange={portfolio.countervalueChange}
      totalBalance={portfolio.balanceHistory[portfolio.balanceHistory.length - 1].value}
      handleChangeSelectedTime={this.handleChangeSelectedTime}
    />
  )

  render() {
    const { accounts, t, counterValue, selectedTimeRange } = this.props
    const totalAccounts = accounts.length
    const totalCurrencies = uniq(accounts.map(a => a.currency.id)).length
    const totalOperations = accounts.reduce((sum, a) => sum + a.operations.length, 0)

    return (
      <Fragment>
        <TopBannerContainer>
          <UpdateBanner />
          <MigrationBanner />
        </TopBannerContainer>
        <RefreshAccountsOrdering onMount />
        <TrackPage
          category="Portfolio"
          totalAccounts={totalAccounts}
          totalOperations={totalOperations}
          totalCurrencies={totalCurrencies}
        />
        <Box flow={7}>
          {totalAccounts > 0 ? (
            <Fragment>
              <BalanceSummary
                counterValue={counterValue}
                chartId="dashboard-chart"
                chartColor={colors.wallet}
                accounts={accounts}
                range={selectedTimeRange}
                Header={this.Header}
                handleChangeSelectedTime={this.handleChangeSelectedTime}
                selectedTimeRange={selectedTimeRange}
              />
              <AssetDistribution />
              {totalOperations > 0 && (
                <OperationsList
                  onAccountClick={this.onAccountClick}
                  accounts={accounts}
                  title={t('dashboard.recentActivity')}
                  withAccount
                  withSubAccounts
                />
              )}
              <StickyBackToTop scrollUpOnMount />
            </Fragment>
          ) : (
            <Redirect to="/accounts" />
          )}
        </Box>
      </Fragment>
    )
  }
}
// This forces only one visible top banner at a time
export const TopBannerContainer = styled.div`
  z-index: 19;

  & > *:not(:first-child) {
    display: none;
  }
`

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(DashboardPage)
