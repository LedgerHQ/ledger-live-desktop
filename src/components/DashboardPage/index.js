// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { createStructuredSelector } from 'reselect'

import type { Account, Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import { colors } from 'styles/theme'

import { accountsSelector } from 'reducers/accounts'
import { counterValueCurrencySelector, localeSelector } from 'reducers/settings'

import { reorderAccounts } from 'actions/accounts'
import { saveSettings } from 'actions/settings'

import UpdateNotifier from 'components/UpdateNotifier'
import BalanceInfos from 'components/BalanceSummary/BalanceInfos'
import BalanceSummary from 'components/BalanceSummary'
import Box from 'components/base/Box'
import PillsDaysCount from 'components/PillsDaysCount'
import Text from 'components/base/Text'
import OperationsList from 'components/OperationsList'

import AccountCard from './AccountCard'
import AccountsOrder from './AccountsOrder'
import EmptyState from './EmptyState'

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  counterValue: counterValueCurrencySelector,
  locale: localeSelector,
})

const mapDispatchToProps = {
  push,
  reorderAccounts,
  saveSettings,
}

type Props = {
  t: T,
  accounts: Account[],
  push: Function,
  counterValue: Currency,
}

type State = {
  selectedTime: string,
  daysCount: number,
}

class DashboardPage extends PureComponent<Props, State> {
  state = {
    // save to user preference?
    selectedTime: 'month',
    daysCount: 30,
  }

  onAccountClick = account => this.props.push(`/account/${account.id}`)

  handleGreeting = () => {
    const localTimeHour = new Date().getHours()
    const afternoon_breakpoint = 12
    const evening_breakpoint = 17

    if (localTimeHour >= afternoon_breakpoint && localTimeHour < evening_breakpoint) {
      return 'dashboard:greeting.afternoon'
    } else if (localTimeHour >= evening_breakpoint) {
      return 'dashboard:greeting.evening'
    }
    return 'dashboard:greeting.morning'
  }

  handleChangeSelectedTime = item =>
    this.setState({
      selectedTime: item.key,
      daysCount: item.value,
    })

  _cacheBalance = null

  render() {
    const { accounts, t, counterValue } = this.props
    const { selectedTime, daysCount } = this.state
    const timeFrame = this.handleGreeting()
    const totalAccounts = accounts.length

    const displayOperationsHelper = (account: Account) => account.operations.length > 0
    const displayOperations = accounts.some(displayOperationsHelper)

    return (
      <Box flow={7}>
        {totalAccounts > 0 ? (
          <Fragment>
            <UpdateNotifier mt={-5} />
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
                  selectedTime={selectedTime}
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
                selectedTime={selectedTime}
                daysCount={daysCount}
                renderHeader={({ totalBalance, selectedTime, sinceBalance, refBalance }) => (
                  <BalanceInfos
                    t={t}
                    counterValue={counterValue}
                    totalBalance={totalBalance}
                    since={selectedTime}
                    sinceBalance={sinceBalance}
                    refBalance={refBalance}
                  />
                )}
              />
              <Box flow={4}>
                <Box horizontal alignItems="flex-end">
                  <Text color="dark" ff="Museo Sans" fontSize={6}>
                    {t('app:sidebar.accounts')}
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
                    .concat(Array(3 - (accounts.length % 3)).fill(null))
                    .map((account, i) => (
                      <Box key={account ? account.id : `placeholder_${i}`} flex="33%" p={16}>
                        {account ? (
                          <AccountCard
                            key={account.id}
                            counterValue={counterValue}
                            account={account}
                            daysCount={daysCount}
                            onClick={this.onAccountClick}
                          />
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
            </Fragment>
          </Fragment>
        ) : (
          <EmptyState />
        )}
      </Box>
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
