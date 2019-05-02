// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistorySelector } from 'actions/portfolio'
import type { Account, BalanceHistory } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import CounterValue from 'components/CounterValue'
import DeltaChange from 'components/DeltaChange'
import Chart from 'components/base/Chart'

class AccountCardBody extends PureComponent<{
  balanceHistory: BalanceHistory,
  account: Account,
}> {
  render() {
    const { balanceHistory, account } = this.props
    const balanceStart = balanceHistory[0].value
    const balanceEnd = balanceHistory[balanceHistory.length - 1].value
    return (
      <Box flow={4}>
        <Box flow={2} horizontal>
          <Box justifyContent="center">
            <CounterValue
              currency={account.currency}
              value={balanceEnd}
              animateTicker={false}
              alwaysShowSign={false}
              showCode
              fontSize={3}
              color="graphite"
            />
          </Box>
          <Box grow justifyContent="center">
            {!balanceStart.isZero() ? (
              <DeltaChange from={balanceStart} to={balanceEnd} alwaysShowSign fontSize={3} />
            ) : null}
          </Box>
        </Box>
        <Chart
          data={balanceHistory}
          color={account.currency.color}
          height={52}
          hideAxis
          isInteractive={false}
          id={`account-chart-${account.id}`}
        />
      </Box>
    )
  }
}

export default connect(
  createStructuredSelector({
    balanceHistory: balanceHistorySelector,
  }),
)(AccountCardBody)
