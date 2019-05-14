// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistoryWithCountervalueSelector } from 'actions/portfolio'
import type { Account, BalanceHistoryWithCountervalue } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import CounterValue from 'components/CounterValue'
import DeltaChange from 'components/DeltaChange'
import Chart from 'components/base/Chart'

class Body extends PureComponent<{
  histo: {
    history: BalanceHistoryWithCountervalue,
    countervalueAvailable: boolean,
  },
  account: Account,
}> {
  // $FlowFixMe
  mapValueCounterValue = d => d.countervalue.toNumber()
  mapValue = d => d.value.toNumber()

  render() {
    const {
      histo: { history, countervalueAvailable },
      account,
    } = this.props
    const balanceStart = history[0].countervalue
    const balanceEnd = history[history.length - 1].countervalue
    return (
      <Box flow={4}>
        <Box flow={2} horizontal>
          <Box justifyContent="center">
            <CounterValue
              currency={account.currency}
              value={history[history.length - 1].value}
              animateTicker={false}
              alwaysShowSign={false}
              showCode
              fontSize={3}
              color="graphite"
            />
          </Box>
          <Box grow justifyContent="center">
            <DeltaChange from={balanceStart} to={balanceEnd} alwaysShowSign fontSize={3} />
          </Box>
        </Box>
        <Chart
          data={history}
          color={account.currency.color}
          mapValue={countervalueAvailable ? this.mapValueCounterValue : this.mapValue}
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
    histo: balanceHistoryWithCountervalueSelector,
  }),
)(Body)
