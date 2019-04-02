// @flow

import React, { PureComponent, Fragment } from 'react'
import uniq from 'lodash/uniq'
import { compose } from 'redux'
import IconNanoX from 'icons/device/NanoXBanner'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { createStructuredSelector } from 'reselect'
import { getDeviceModel } from '@ledgerhq/devices'
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
import PillsDaysCount from 'components/PillsDaysCount'
import OperationsList from 'components/OperationsList'
import StickyBackToTop from 'components/StickyBackToTop'
import styled from 'styled-components'
import { openURL } from 'helpers/linking'
import BalanceSummary from './BalanceSummary'
import EmptyState from './EmptyState'
import CurrentGreetings from './CurrentGreetings'
import SummaryDesc from './SummaryDesc'
import AccountCardList from './AccountCardList'
import TopBanner, { FakeLink } from '../TopBanner'
import { urls } from '../../config/urls'

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

  Header = ({ balanceAvailable, balanceHistory }) => (
    <BalanceInfos
      t={this.props.t}
      unit={this.props.counterValue.units[0]}
      isAvailable={balanceAvailable}
      totalBalance={balanceHistory[balanceHistory.length - 1].value}
      since={this.props.selectedTimeRange}
      sinceBalance={balanceHistory[0].value}
      refBalance={balanceHistory[0].value}
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
          <TopBanner
            content={{
              message: t('banners.promoteMobile', getDeviceModel('nanoX')),
              Icon: IconNanoX,
              right: (
                <FakeLink onClick={() => openURL(urls.promoNanoX)}>
                  {t('common.learnMore')}
                </FakeLink>
              ),
            }}
            status={'dark'}
            bannerId={'promoNanoX'}
            dismissable
          />
          <SeparatorBar />
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
              <Box horizontal alignItems="flex-end">
                <Box grow>
                  <CurrentGreetings />
                  <SummaryDesc totalAccounts={totalAccounts} />
                </Box>
                <Box>
                  <PillsDaysCount
                    selected={selectedTimeRange}
                    onChange={this.handleChangeSelectedTime}
                  />
                </Box>
              </Box>

              <BalanceSummary
                counterValue={counterValue}
                chartId="dashboard-chart"
                chartColor={colors.wallet}
                accounts={accounts}
                range={selectedTimeRange}
                Header={this.Header}
              />

              <AccountCardList
                onAccountClick={this.onAccountClick}
                accounts={accounts}
                range={selectedTimeRange}
              />

              {totalOperations > 0 && (
                <OperationsList
                  onAccountClick={this.onAccountClick}
                  accounts={accounts}
                  title={t('dashboard.recentActivity')}
                  withAccount
                />
              )}
              <StickyBackToTop />
            </Fragment>
          ) : (
            <EmptyState />
          )}
        </Box>
      </Fragment>
    )
  }
}
// This forces only one visible top banner at a time
const TopBannerContainer = styled.div`
  & > *:not(:first-child) {
    display: none;
  }
`
// If no banners are present, the SeparatorBar appears
export const SeparatorBar = styled.div`
  height: 1px;
  border-bottom: 1px solid ${p => p.theme.colors.fog};
  margin-bottom: 15px;
  margin-top: -20px;
`

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(DashboardPage)
