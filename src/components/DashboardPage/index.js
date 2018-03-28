// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { Account, Operation } from '@ledgerhq/wallet-common/lib/types'

import chunk from 'lodash/chunk'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import type { T } from 'types/common'

import { getVisibleAccounts } from 'reducers/accounts'
import { getCounterValueCode } from 'reducers/settings'

import { updateOrderAccounts } from 'actions/accounts'
import { saveSettings } from 'actions/settings'

import BalanceInfos from 'components/BalanceSummary/BalanceInfos'
import BalanceSummary from 'components/BalanceSummary'
import Box from 'components/base/Box'
import PillsDaysCount from 'components/PillsDaysCount'
import Text from 'components/base/Text'
import OperationsList from 'components/OperationsList'

import AccountCard from './AccountCard'
import AccountsOrder from './AccountsOrder'

const mapStateToProps = state => ({
  accounts: getVisibleAccounts(state),
  counterValue: getCounterValueCode(state),
})

const mapDispatchToProps = {
  push,
  updateOrderAccounts,
  saveSettings,
}

type Props = {
  t: T,
  accounts: Account[],
  push: Function,
  counterValue: string,
}

type State = {
  accountsChunk: Array<Array<Account | null>>,
  allOperations: Operation[],
  selectedTime: string,
  daysCount: number,
}

const ACCOUNTS_BY_LINE = 3
const ALL_OPERATIONS_LIMIT = 10

const getAllOperations = accounts => {
  const allOperations = accounts.reduce((result, account) => {
    const operations = get(account, 'operations', [])

    result = [
      ...result,
      ...operations.map(t => ({
        ...t,
        account,
      })),
    ]

    return result
  }, [])

  return sortBy(allOperations, t => t.date)
    .reverse()
    .slice(0, ALL_OPERATIONS_LIMIT)
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
    allOperations: getAllOperations(this.props.accounts),
    selectedTime: 'week',
    daysCount: 7,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts !== this.props.accounts) {
      this.setState({
        accountsChunk: getAccountsChunk(nextProps.accounts),
        allOperations: getAllOperations(nextProps.accounts),
      })
    }
  }

  handleChangeSelectedTime = item =>
    this.setState({
      selectedTime: item.key,
      daysCount: item.value,
    })

  render() {
    const { push, accounts, t, counterValue } = this.props
    const { accountsChunk, allOperations, selectedTime, daysCount } = this.state

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
              counterValue={counterValue}
              chartId="dashboard-chart"
              chartColor="#5286f7"
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
            <OperationsList
              canShowMore
              onAccountClick={account => push(`/account/${account.id}`)}
              operations={allOperations}
              title={t('dashboard:recentActivity')}
              withAccount
            />
          </Fragment>
        )}
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(DashboardPage)
