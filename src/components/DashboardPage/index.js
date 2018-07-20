// @flow

import React, { PureComponent, Fragment } from 'react'
import uniq from 'lodash/uniq'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { push } from 'react-router-redux'
import { createStructuredSelector } from 'reselect'
import type { Account, Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import { colors } from 'styles/theme'

import { accountsSelector } from 'reducers/accounts'
import { openModal } from 'reducers/modals'
import { MODAL_ADD_ACCOUNTS } from 'config/constants'
import {
  counterValueCurrencySelector,
  localeSelector,
  selectedTimeRangeSelector,
  timeRangeDaysByKey,
} from 'reducers/settings'
import type { TimeRange } from 'reducers/settings'

import { saveSettings } from 'actions/settings'

import TrackPage from 'analytics/TrackPage'
import RefreshAccountsOrdering from 'components/RefreshAccountsOrdering'
import UpdateNotifier from 'components/UpdateNotifier'
import BalanceInfos from 'components/BalanceSummary/BalanceInfos'
import BalanceSummary from 'components/BalanceSummary'
import Box from 'components/base/Box'
import { i } from 'helpers/staticPath'
import PillsDaysCount from 'components/PillsDaysCount'
import Text from 'components/base/Text'
import OperationsList from 'components/OperationsList'
import StickyBackToTop from 'components/StickyBackToTop'
import Button from 'components/base/Button'
import AccountCard from './AccountCard'
import AccountsOrder from './AccountsOrder'
import EmptyState from './EmptyState'

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  counterValue: counterValueCurrencySelector,
  locale: localeSelector,
  selectedTimeRange: selectedTimeRangeSelector,
})

const mapDispatchToProps = {
  push,
  saveSettings,
  openModal,
}

type Props = {
  t: T,
  accounts: Account[],
  push: Function,
  counterValue: Currency,
  selectedTimeRange: TimeRange,
  saveSettings: ({ selectedTimeRange: TimeRange }) => *,
  openModal: string => void,
}

class DashboardPage extends PureComponent<Props> {
  onAccountClick = account => this.props.push(`/account/${account.id}`)

  handleGreeting = () => {
    const localTimeHour = new Date().getHours()
    const afternoon_breakpoint = 12
    const evening_breakpoint = 17

    if (localTimeHour >= afternoon_breakpoint && localTimeHour < evening_breakpoint) {
      return 'app:dashboard.greeting.afternoon'
    } else if (localTimeHour >= evening_breakpoint) {
      return 'app:dashboard.greeting.evening'
    }
    return 'app:dashboard.greeting.morning'
  }

  handleChangeSelectedTime = item => {
    this.props.saveSettings({ selectedTimeRange: item.key })
  }

  _cacheBalance = null

  render() {
    const { accounts, t, counterValue, selectedTimeRange, openModal } = this.props
    const daysCount = timeRangeDaysByKey[selectedTimeRange]
    const timeFrame = this.handleGreeting()
    const imagePath = i('empty-account-tile.svg')
    const totalAccounts = accounts.length
    const totalCurrencies = uniq(accounts.map(a => a.currency.id)).length
    const totalOperations = accounts.reduce((sum, a) => sum + a.operations.length, 0)
    const displayOperationsHelper = (account: Account) => account.operations.length > 0
    const displayOperations = accounts.some(displayOperationsHelper)

    return (
      <Fragment>
        <UpdateNotifier />
        <RefreshAccountsOrdering onMount />
        <TrackPage
          category="Portfolio"
          totalAccounts={totalAccounts}
          totalOperations={totalOperations}
          totalCurrencies={totalCurrencies}
        />
        <Box flow={7} selectable>
          {totalAccounts > 0 ? (
            <Fragment>
              <Box horizontal alignItems="flex-end">
                <Box grow>
                  <Text color="dark" ff="Museo Sans" fontSize={7}>
                    {t(timeFrame)}
                  </Text>
                  <Text color="grey" fontSize={5} ff="Museo Sans|Light">
                    {t('app:dashboard.summary', { count: totalAccounts })}
                  </Text>
                </Box>
                <Box>
                  <PillsDaysCount
                    selected={selectedTimeRange}
                    onChange={this.handleChangeSelectedTime}
                  />
                </Box>
              </Box>
              <Fragment>
                <BalanceSummary
                  counterValue={counterValue}
                  chartId="dashboard-chart"
                  chartColor={colors.wallet}
                  accounts={accounts}
                  selectedTimeRange={selectedTimeRange}
                  daysCount={daysCount}
                  renderHeader={({
                    isAvailable,
                    totalBalance,
                    selectedTimeRange,
                    sinceBalance,
                    refBalance,
                  }) => (
                    <BalanceInfos
                      t={t}
                      counterValue={counterValue}
                      isAvailable={isAvailable}
                      totalBalance={totalBalance}
                      since={selectedTimeRange}
                      sinceBalance={sinceBalance}
                      refBalance={refBalance}
                    />
                  )}
                />
                <Box flow={4}>
                  <Box horizontal alignItems="flex-end">
                    <Text color="dark" ff="Museo Sans" fontSize={6}>
                      {t('app:dashboard.accounts.title', { count: accounts.length })}
                    </Text>
                    <Box ml="auto" horizontal flow={1}>
                      <AccountsOrder />
                    </Box>
                  </Box>
                  <Box
                    horizontal
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    alignItems="center"
                    style={{ margin: '0 -16px' }}
                  >
                    {accounts
                      .concat(
                        Array(3 - (accounts.length % 3))
                          .fill(null)
                          .map((_, i) => i === 0),
                      )
                      .map((account, i) => (
                        <Box
                          key={typeof account === 'object' ? account.id : `placeholder_${i}`}
                          flex="33%"
                          p={16}
                        >
                          {account ? (
                            typeof account === 'object' ? (
                              <AccountCard
                                key={account.id}
                                counterValue={counterValue}
                                account={account}
                                daysCount={daysCount}
                                onClick={this.onAccountClick}
                              />
                            ) : (
                              <Wrapper>
                                <Box mt={2}>
                                  <img alt="" src={imagePath} />
                                </Box>
                                <Box
                                  ff="Open Sans"
                                  fontSize={3}
                                  color="grey"
                                  pb={2}
                                  mt={3}
                                  textAlign="center"
                                  style={{ maxWidth: 150 }}
                                >
                                  {t('app:dashboard.emptyAccountTile.desc')}
                                </Box>
                                <Button primary onClick={() => openModal(MODAL_ADD_ACCOUNTS)}>
                                  {t('app:dashboard.emptyAccountTile.createAccount')}
                                </Button>
                              </Wrapper>
                            )
                          ) : null}
                        </Box>
                      ))}
                  </Box>
                </Box>
                {displayOperations && (
                  <OperationsList
                    onAccountClick={this.onAccountClick}
                    accounts={accounts}
                    title={t('app:dashboard.recentActivity')}
                    withAccount
                  />
                )}
                <StickyBackToTop />
              </Fragment>
            </Fragment>
          ) : (
            <EmptyState />
          )}
        </Box>
      </Fragment>
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(DashboardPage)

const Wrapper = styled(Box).attrs({
  p: 4,
  flex: 1,
  alignItems: 'center',
})`
  border: 1px dashed ${p => p.theme.colors.fog};
  border-radius: 4px;
  height: 215px;
`
