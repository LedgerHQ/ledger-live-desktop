// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistorySelector } from 'actions/portfolio'
import type { Account, BalanceHistory } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import CounterValue from 'components/CounterValue'

class Countervalue extends PureComponent<{
  balanceHistory: BalanceHistory,
  account: Account,
}> {
  render() {
    const { balanceHistory, account, ...rest } = this.props
    const balanceEnd = balanceHistory[balanceHistory.length - 1].value
    return (
      <Box {...rest}>
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
    )
  }
}

export default connect(
  createStructuredSelector({
    balanceHistory: balanceHistorySelector,
  }),
)(Countervalue)
