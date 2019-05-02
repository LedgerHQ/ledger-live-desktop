// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistorySelector } from 'actions/portfolio'
import type { Account, BalanceHistory, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import DeltaChange from 'components/DeltaChange'

class Delta extends PureComponent<{
  balanceHistory: BalanceHistory,
  account: Account,
  range: PortfolioRange,
}> {
  render() {
    const { balanceHistory, ...rest } = this.props
    const balanceStart = balanceHistory[0].value
    const balanceEnd = balanceHistory[balanceHistory.length - 1].value
    return (
      <Box {...rest} justifyContent="center">
        {!balanceStart.isZero() ? (
          <DeltaChange from={balanceStart} to={balanceEnd} alwaysShowSign fontSize={3} />
        ) : null}
      </Box>
    )
  }
}

export default connect(
  createStructuredSelector({
    balanceHistory: balanceHistorySelector,
  }),
)(Delta)
