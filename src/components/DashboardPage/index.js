// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import chunk from 'lodash/chunk'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import type { MapStateToProps } from 'react-redux'
import type { Account, Accounts, T } from 'types/common'

import { getVisibleAccounts } from 'reducers/accounts'

import { updateOrderAccounts } from 'actions/accounts'
import { saveSettings } from 'actions/settings'

import BalanceInfos from 'components/BalanceSummary/BalanceInfos'
import BalanceSummary from 'components/BalanceSummary'
import Box from 'components/base/Box'
import PillsDaysCount from 'components/PillsDaysCount'
import Text from 'components/base/Text'
import TransactionsList from 'components/TransactionsList'

import AccountCard from './AccountCard'
import AccountsOrder from './AccountsOrder'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getVisibleAccounts(state),
})

const mapDispatchToProps = {
  push,
  updateOrderAccounts,
  saveSettings,
}

type Props = {
  t: T,
  accounts: Accounts,
  push: Function,
}

type State = {
  accountsChunk: Array<Array<Account | null>>,
  allTransactions: Array<Object>,
  selectedTime: string,
  daysCount: number,
}

const ACCOUNTS_BY_LINE = 3
const ALL_TRANSACTIONS_LIMIT = 10

const getAllTransactions = accounts => {
  const allTransactions = accounts.reduce((result, account) => {
    const transactions = get(account, 'transactions', [])

    result = [
      ...result,
      ...transactions.map(t => ({
        ...t,
        account,
      })),
    ]

    return result
  }, [])

  return sortBy(allTransactions, t => t.receivedAt)
    .reverse()
    .slice(0, ALL_TRANSACTIONS_LIMIT)
}

const getAccountsChunk = accounts => {
  // create shallow copy of accounts, to be mutated
  const listAccounts = [...accounts]

  while (listAccounts.length % ACCOUNTS_BY_LINE !== 0) listAccounts.push(null)

  return chunk(listAccounts, ACCOUNTS_BY_LINE)
}

class DashboardPage extends PureComponent<Props, State> {
  state = {
    accountsChunk: getAccountsChunk(this.props.accounts),
    allTransactions: getAllTransactions(this.props.accounts),
    selectedTime: 'week',
    daysCount: 7,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts !== this.props.accounts) {
      this.setState({
        accountsChunk: getAccountsChunk(nextProps.accounts),
        allTransactions: getAllTransactions(nextProps.accounts),
      })
    }
  }

  handleChangeSelectedTime = item =>
    this.setState({
      selectedTime: item.key,
      daysCount: item.value,
    })

  render() {
    const { push, accounts, t } = this.props
    const { accountsChunk, allTransactions, selectedTime, daysCount } = this.state

    const totalAccounts = accounts.length

    return (
      <Box flow={7}>
        <Box horizontal alignItems="flex-end">
          <Box grow>
            <Text color="dark" ff="Museo Sans" fontSize={7}>
              {t('dashboard:greetings', { name: 'Khalil' })}
            </Text>
            <Text color="grey" fontSize={5} ff="Museo Sans|Light">
              {totalAccounts > 0
                ? t('dashboard:summary', { count: totalAccounts })
                : t('dashboard:noAccounts')}
            </Text>
          </Box>
          <Box>
            <PillsDaysCount selectedTime={selectedTime} onChange={this.handleChangeSelectedTime} />
          </Box>
        </Box>
        {totalAccounts > 0 && (
          <Fragment>
            <BalanceSummary
              chartId="dashboard-chart"
              chartColor="#5286f7"
              accounts={accounts}
              selectedTime={selectedTime}
              daysCount={daysCount}
              renderHeader={({ totalBalance, selectedTime, sinceBalance }) => (
                <BalanceInfos
                  t={t}
                  fiat="USD"
                  totalBalance={totalBalance}
                  since={selectedTime}
                  sinceBalance={sinceBalance}
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
            <TransactionsList
              title={t('dashboard:recentActivity')}
              withAccounts
              transactions={allTransactions}
              onAccountClick={account => push(`/account/${account.id}`)}
            />
          </Fragment>
        )}
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(DashboardPage)
