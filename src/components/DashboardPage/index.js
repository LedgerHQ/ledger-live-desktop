// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import chunk from 'lodash/chunk'
import get from 'lodash/get'
import random from 'lodash/random'
import sortBy from 'lodash/sortBy'
import takeRight from 'lodash/takeRight'

import type { MapStateToProps } from 'react-redux'
import type { Accounts, T } from 'types/common'

import { space } from 'styles/theme'

import { getVisibleAccounts } from 'reducers/accounts'

import { updateOrderAccounts } from 'actions/accounts'
import { saveSettings } from 'actions/settings'

import { AreaChart } from 'components/base/Chart'
import Box, { Card } from 'components/base/Box'
import Pills from 'components/base/Pills'
import Text from 'components/base/Text'
import TransactionsList from 'components/TransactionsList'

import AccountCard from './AccountCard'
import BalanceInfos from './BalanceInfos'
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
  accountsChunk: Array<any>,
  allTransactions: Array<Object>,
  fakeDatas: Object,
  fakeDatasMerge: Array<any>,
  selectedTime: string,
}

const ACCOUNTS_BY_LINE = 3
const ALL_TRANSACTIONS_LIMIT = 10
const TIMEOUT_REFRESH_DATAS = 5e3

const itemsTimes = [{ key: 'day' }, { key: 'week' }, { key: 'month' }, { key: 'year' }]

const generateFakeData = v => ({
  index: v,
  name: `Day ${v}`,
  value: random(10, 100),
})

const generateFakeDatas = accounts =>
  accounts.reduce((result, a) => {
    result[a.id] = [...Array(25).keys()].map(v => generateFakeData(v + 1))

    return result
  }, {})

const mergeFakeDatas = fakeDatas =>
  takeRight(
    Object.keys(fakeDatas).reduce((res, k) => {
      const data = fakeDatas[k]
      data.forEach((d, i) => {
        res[i] = {
          name: d.name,
          value: (res[i] ? res[i].value : 0) + d.value,
        }
      })
      return res
    }, []),
    25,
  )

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
  constructor(props) {
    super()

    const fakeDatas = generateFakeDatas(props.accounts)

    this.state = {
      accountsChunk: getAccountsChunk(props.accounts),
      allTransactions: getAllTransactions(props.accounts),
      fakeDatas,
      fakeDatasMerge: mergeFakeDatas(fakeDatas),
      selectedTime: 'day',
    }
  }

  componentWillMount() {
    this._itemsTimes = itemsTimes.map(item => ({
      ...item,
      label: this.props.t(`time.${item.key}`),
    }))
  }

  componentDidMount() {
    this._mounted = true

    this.addFakeDatasOnAccounts()
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.state.fakeDatas).length === 0) {
      const fakeDatas = generateFakeDatas(nextProps.accounts)

      this.setState({
        fakeDatas,
        fakeDatasMerge: mergeFakeDatas(fakeDatas),
      })
    }

    if (nextProps.accounts !== this.props.accounts) {
      this.setState({
        accountsChunk: getAccountsChunk(nextProps.accounts),
        allTransactions: getAllTransactions(nextProps.accounts),
      })
    }
  }

  componentWillUnmount() {
    this._mounted = false
    clearTimeout(this._timeout)
  }

  addFakeDatasOnAccounts = () => {
    this._timeout = setTimeout(() => {
      const { fakeDatas } = this.state

      const newFakeDatas = {}

      Object.keys(fakeDatas).forEach(k => {
        const data = fakeDatas[k]

        data.shift()

        const lastIndex = data[data.length - 1]

        newFakeDatas[k] = [...data, generateFakeData(lastIndex.index + 1)]
      })

      window.requestIdleCallback(() => {
        if (this._mounted) {
          this.setState({
            fakeDatas: newFakeDatas,
            fakeDatasMerge: mergeFakeDatas(newFakeDatas),
          })
        }

        this.addFakeDatasOnAccounts()
      })
    }, TIMEOUT_REFRESH_DATAS)
  }

  _timeout = undefined
  _mounted = false
  _itemsTimes = []

  render() {
    const { push, accounts, t } = this.props
    const { accountsChunk, allTransactions, selectedTime, fakeDatas, fakeDatasMerge } = this.state

    const totalAccounts = accounts.length

    return (
      <Box flow={7}>
        <Box horizontal alignItems="flex-end">
          <Box>
            <Text color="dark" ff="Museo Sans" fontSize={7}>
              {t('dashboard.greetings', { name: 'Khalil' })}
            </Text>
            <Text color="grey" fontSize={5} ff="Museo Sans|Light">
              {totalAccounts > 0
                ? t('dashboard.summary', { count: totalAccounts })
                : t('dashboard.noAccounts')}
            </Text>
          </Box>
          <Box ml="auto">
            <Pills
              items={this._itemsTimes}
              activeKey={selectedTime}
              onChange={item => this.setState({ selectedTime: item.key })}
            />
          </Box>
        </Box>
        {totalAccounts > 0 && (
          <Fragment>
            <Card flow={3} p={0} py={6}>
              <Box px={6}>
                <BalanceInfos since={selectedTime} />
              </Box>
              <Box ff="Open Sans" fontSize={4} color="graphite">
                <AreaChart
                  id="dashboard-chart"
                  padding={{
                    top: space[6],
                    bottom: space[6],
                    left: space[6] * 2,
                    right: space[6],
                  }}
                  color="#5286f7"
                  height={250}
                  data={fakeDatasMerge}
                  strokeWidth={2}
                />
              </Box>
            </Card>
            <Box flow={4}>
              <Box horizontal alignItems="flex-end">
                <Text color="dark" ff="Museo Sans" fontSize={6}>
                  {t('sidebar.accounts')}
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
                            key={account.id}
                            account={account}
                            data={fakeDatas[account.id]}
                            onClick={() => push(`/account/${account.id}`)}
                          />
                        ),
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Card p={0} px={4} title={t('dashboard.recentActivity')}>
              <TransactionsList
                withAccounts
                transactions={allTransactions}
                onAccountClick={account => push(`/account/${account.id}`)}
              />
            </Card>
          </Fragment>
        )}
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(DashboardPage)
