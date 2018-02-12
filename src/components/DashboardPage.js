// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import chunk from 'lodash/chunk'
import random from 'lodash/random'
import takeRight from 'lodash/takeRight'

import type { MapStateToProps } from 'react-redux'
import type { Accounts } from 'types/common'

import { formatBTC } from 'helpers/format'

import { getTotalBalance, getVisibleAccounts } from 'reducers/accounts'

import Box, { Card } from 'components/base/Box'
import Pills from 'components/base/Pills'
import Text from 'components/base/Text'
import { AreaChart, BarChart } from 'components/base/Chart'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getVisibleAccounts(state),
  totalBalance: getTotalBalance(state),
})

const mapDispatchToProps = {
  push,
}

type Props = {
  accounts: Accounts,
  push: Function,
  totalBalance: number,
}

type State = {
  fakeDatas: Array<any>,
  selectedTime: string,
}

const ACCOUNTS_BY_LINE = 3
const TIMEOUT_REFRESH_DATAS = 5e3

const itemsTimes = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
]

const generateFakeData = v => ({
  name: `Day ${v}`,
  value: random(10, 100),
})

class DashboardPage extends PureComponent<Props, State> {
  state = {
    selectedTime: 'day',
    fakeDatas: this.generateFakeDatas(),
  }

  componentDidMount() {
    this.addFakeDatasOnAccounts()
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
  }

  getAccountsChunk() {
    const { accounts } = this.props

    // create shallow copy of accounts, to be mutated
    const listAccounts = [...accounts]

    while (listAccounts.length % ACCOUNTS_BY_LINE !== 0) listAccounts.push(null)

    return chunk(listAccounts, ACCOUNTS_BY_LINE)
  }

  generateFakeDatas() {
    const { accounts } = this.props
    return accounts.map(() => [...Array(25).keys()].map(v => generateFakeData(v + 1)))
  }

  addFakeDatasOnAccounts = () => {
    this._timeout = setTimeout(() => {
      const { accounts } = this.props

      this.setState(prev => ({
        fakeDatas: [
          ...accounts.reduce((res, acc, i) => {
            if (res[i]) {
              const nextIndex = res[i].length
              res[i][nextIndex] = generateFakeData(nextIndex)
            }
            return res
          }, prev.fakeDatas),
        ],
      }))

      this.addFakeDatasOnAccounts()
    }, TIMEOUT_REFRESH_DATAS)
  }

  _timeout = undefined

  render() {
    const { totalBalance, push, accounts } = this.props
    const { selectedTime, fakeDatas } = this.state

    const totalAccounts = accounts.length

    return (
      <Box flow={4}>
        <Box horizontal align="flex-end">
          <Box>
            <Text color="black" fontSize={6}>
              {'Hello Anonymous,'}
            </Text>
            <Text color="grey" fontSize={3}>
              {totalAccounts > 0
                ? `here is the summary of your ${totalAccounts} accounts`
                : 'no accounts'}
            </Text>
          </Box>
          <Box ml="auto">
            <Pills
              items={itemsTimes}
              activeKey={selectedTime}
              onChange={item => this.setState({ selectedTime: item.key })}
            />
          </Box>
        </Box>
        {totalAccounts > 0 && (
          <Fragment>
            <Card flow={3} p={4}>
              <Text>{formatBTC(totalBalance)}</Text>
              <AreaChart
                height={250}
                data={takeRight(
                  fakeDatas.reduce((res, data) => {
                    data.forEach((d, i) => {
                      res[i] = {
                        name: d.name,
                        value: (res[i] ? res[i].value : 0) + d.value,
                      }
                    })
                    return res
                  }, []),
                  25,
                )}
              />
            </Card>
            <Box flow={3}>
              {this.getAccountsChunk().map((accountsByLine, i) => (
                <Box
                  key={i} // eslint-disable-line react/no-array-index-key
                  horizontal
                  flow={3}
                >
                  {accountsByLine.map(
                    (account: any, j) =>
                      account === null ? (
                        <Box
                          key={j} // eslint-disable-line react/no-array-index-key
                          p={2}
                          flex={1}
                        />
                      ) : (
                        <Card
                          key={account.id}
                          p={2}
                          flex={1}
                          style={{ cursor: 'pointer' }}
                          onClick={() => push(`/account/${account.id}`)}
                        >
                          <Box>
                            <Text fontWeight="bold">{account.name}</Text>
                          </Box>
                          <Box grow align="center" justify="center">
                            {account.data && formatBTC(account.data.balance)}
                          </Box>
                          <BarChart height={100} data={takeRight(fakeDatas[j], 25)} />
                        </Card>
                      ),
                  )}
                </Box>
              ))}
            </Box>
          </Fragment>
        )}
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(DashboardPage)
