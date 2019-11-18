// @flow

import React, { useCallback, useMemo } from 'react'
import uniq from 'lodash/uniq'
import { Redirect } from 'react-router'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
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
import AssetDistribution from 'components/AssetDistribution'
import MigrationBanner from 'components/modals/MigrateAccounts/Banner'
import DelegationBanner from 'families/tezos/Delegation/DelegationBanner'
import BalanceSummary from './BalanceSummary'

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

function DashboardPage({
  accounts,
  t,
  counterValue,
  selectedTimeRange,
  push,
  saveSettings,
}: Props) {
  const totalAccounts = accounts.length
  const totalCurrencies = useMemo(() => uniq(accounts.map(a => a.currency.id)).length, [accounts])
  const totalOperations = useMemo(() => accounts.reduce((sum, a) => sum + a.operations.length, 0), [
    accounts,
  ])

  const onAccountClick = useCallback(account => push(`/account/${account.id}`), [push])

  const handleChangeSelectedTime = useCallback(
    item => saveSettings({ selectedTimeRange: item.key }),
    [saveSettings],
  )

  const Header = useCallback(
    ({ portfolio }) => (
      <BalanceInfos
        t={t}
        unit={counterValue.units[0]}
        isAvailable={portfolio.balanceAvailable}
        since={selectedTimeRange}
        valueChange={portfolio.countervalueChange}
        totalBalance={portfolio.balanceHistory[portfolio.balanceHistory.length - 1].value}
        handleChangeSelectedTime={handleChangeSelectedTime}
      />
    ),
    [t, counterValue.units, selectedTimeRange, handleChangeSelectedTime],
  )

  return (
    <>
      <TopBannerContainer>
        <UpdateBanner />
        <MigrationBanner />
        <DelegationBanner />
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
          <>
            <BalanceSummary
              counterValue={counterValue}
              chartId="dashboard-chart"
              chartColor={colors.wallet}
              accounts={accounts}
              range={selectedTimeRange}
              Header={Header}
              handleChangeSelectedTime={handleChangeSelectedTime}
              selectedTimeRange={selectedTimeRange}
            />
            <AssetDistribution />
            {totalOperations > 0 && (
              <OperationsList
                onAccountClick={onAccountClick}
                accounts={accounts}
                title={t('dashboard.recentActivity')}
                withAccount
                withSubAccounts
              />
            )}
            <StickyBackToTop scrollUpOnMount />
          </>
        ) : (
          <Redirect to="/accounts" />
        )}
      </Box>
    </>
  )
}

// This forces only one visible top banner at a time
export const TopBannerContainer = styled.div`
  z-index: 19;
  margin-bottom: 16px;

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
