// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import chunk from 'lodash/chunk'
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
  accountsChunk: Array<Array<?Account>>,
  selectedTime: string,
  daysCount: number,
}

const ACCOUNTS_BY_LINE = 3

const getAccountsChunk = accounts => {
  // create shallow copy of accounts, to be mutated
  const listAccounts = [...accounts]

  while (listAccounts.length % ACCOUNTS_BY_LINE !== 0) listAccounts.push(null)

  return chunk(listAccounts, ACCOUNTS_BY_LINE)
}

class DashboardPage extends PureComponent<Props, State> {
  state = {
    accountsChunk: getAccountsChunk(this.props.accounts),
    selectedTime: 'week',
    daysCount: 7,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts !== this.props.accounts) {
      this.setState({
        accountsChunk: getAccountsChunk(nextProps.accounts),
      })
    }
  }

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
    const { push, accounts, t, counterValue } = this.props
    const { accountsChunk, selectedTime, daysCount } = this.state
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
                  {t('dashboard:summary', { count: totalAccounts })}
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
                    {t('sidebar:accounts')}
                  </Text>
                  <Box ml="auto" horizontal flow={1}>
                    <AccountsOrder />
                  </Box>
                </Box>
                <Box flow={5}>
                  {accountsChunk.map((accountsByLine, i) => (
                    <Box
                      key={i} // eslint-disable-line react/no-array-index-key
                      horizontal
                      flow={5}
                    >
                      {accountsByLine.map(
                        (account: any, j) =>
                          account === null ? (
                            <Box
                              key={j} // eslint-disable-line react/no-array-index-key
                              p={4}
                              flex={1}
                            />
                          ) : (
                            <AccountCard
                              counterValue={counterValue}
                              account={account}
                              daysCount={daysCount}
                              key={account.id}
                              onClick={() => push(`/account/${account.id}`)}
                            />
                          ),
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
              {displayOperations && (
                <OperationsList
                  canShowMore
                  onAccountClick={account => push(`/account/${account.id}`)}
                  accounts={accounts}
                  title={t('dashboard:recentActivity')}
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

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(DashboardPage)
