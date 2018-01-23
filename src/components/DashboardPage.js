// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'

import { format } from 'helpers/btc'

import { getTotalBalance } from 'reducers/accounts'

import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'
import Select from 'components/base/Select'
import Tabs from 'components/base/Tabs'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  totalBalance: getTotalBalance(state),
})

type Props = {
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
    const { totalBalance } = this.props
    const { tab } = this.state
    return (
      <Box flow={4}>
        <Box horizontal align="flex-end">
          <Box>
            <Text color="black" fontSize={6}>
              {'Hello Anonymous,'}
            </Text>
            <Text color="grey" fontSize={3}>
              {'here is the summary of your 5 accounts'}
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
                    <Text fontSize={4}>{format(totalBalance)}</Text>
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
          <Box horizontal flow={3}>
            <Card flex={1} style={{ height: 200 }}>
              {'Brian account'}
            </Card>
            <Card flex={1} style={{ height: 200 }}>
              {'Virginie account'}
            </Card>
            <Card flex={1} style={{ height: 200 }}>
              {'Ledger account'}
            </Card>
          </Box>
          <Box horizontal flow={3}>
            <Card flex={1} style={{ height: 200 }}>
              {'Brian account'}
            </Card>
            <Card flex={1} style={{ height: 200 }}>
              {'Virginie account'}
            </Card>
            <Box
              p={3}
              flex={1}
              borderWidth={2}
              align="center"
              justify="center"
              borderColor="mouse"
              style={{ borderStyle: 'dashed' }}
            >
              {'+ Add account'}
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
}

export default connect(mapStateToProps)(DashboardPage)
