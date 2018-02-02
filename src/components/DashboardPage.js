// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import chunk from 'lodash/chunk'
import { push } from 'react-router-redux'

import { MODAL_ADD_ACCOUNT } from 'constants'

import type { MapStateToProps } from 'react-redux'
import type { Accounts, T } from 'types/common'

import { formatBTC } from 'helpers/format'

import { openModal } from 'reducers/modals'
import { getTotalBalance, getVisibleAccounts } from 'reducers/accounts'

import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'
import Select from 'components/base/Select'
import Tabs from 'components/base/Tabs'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getVisibleAccounts(state),
  totalBalance: getTotalBalance(state),
})

const mapDispatchToProps = {
  push,
  openModal,
}

type Props = {
  t: T,
  accounts: Accounts,
  push: Function,
  openModal: Function,
  totalBalance: number,
}

type State = {
  tab: number,
}

const itemsTimes = [
  { key: 'week', name: 'Last week' },
  { key: 'month', name: 'Last month' },
  { key: 'year', name: 'Last year' },
]

class DashboardPage extends PureComponent<Props, State> {
  state = {
    tab: 0,
  }

  handleChangeTab = tab => this.setState({ tab })

  render() {
    const { t, totalBalance, openModal, push, accounts } = this.props
    const { tab } = this.state

    const totalAccounts = Object.keys(accounts).length

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
            <Select
              items={itemsTimes}
              value={itemsTimes[0]}
              renderSelected={item => item.name}
              style={{ width: 250 }}
            />
          </Box>
        </Box>
        <Card flow={3}>
          <Tabs
            index={tab}
            onTabClick={this.handleChangeTab}
            items={[
              {
                key: 'balance',
                title: 'Total balance',
                render: () => (
                  <Box>
                    <Text fontSize={4}>{formatBTC(totalBalance)}</Text>
                  </Box>
                ),
              },
              {
                key: 'market',
                title: 'Market',
                render: () => <Box>{'Not yet. Be patient.'}</Box>,
              },
            ]}
          />
        </Card>
        <Box flow={3}>
          {chunk([...Object.keys(accounts), MODAL_ADD_ACCOUNT], 3).map((line, i) => (
            <Box
              key={i} // eslint-disable-line react/no-array-index-key
              horizontal
              flow={3}
            >
              {line.map(
                key =>
                  key === MODAL_ADD_ACCOUNT ? (
                    <Box
                      key={key}
                      p={3}
                      flex={1}
                      borderWidth={2}
                      align="center"
                      justify="center"
                      borderColor="mouse"
                      style={{ borderStyle: 'dashed', cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => openModal(MODAL_ADD_ACCOUNT)}
                    >
                      {`+ ${t('addAccount.title')}`}
                    </Box>
                  ) : (
                    <Card
                      key={key}
                      flex={1}
                      style={{ cursor: 'pointer', height: 200 }}
                      onClick={() => push(`/account/${key}`)}
                    >
                      <Box>
                        <Text fontWeight="bold">{accounts[key].name}</Text>
                      </Box>
                      <Box grow align="center" justify="center">
                        {accounts[key].data && formatBTC(accounts[key].data.balance)}
                      </Box>
                    </Card>
                  ),
              )}
            </Box>
          ))}
        </Box>
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(DashboardPage)
