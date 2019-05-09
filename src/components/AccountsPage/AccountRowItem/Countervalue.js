// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistoryWithCountervalueSelector } from 'actions/portfolio'
import type { Account, BalanceHistoryWithCountervalue } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import CounterValue from 'components/CounterValue'
import { PlaceholderLine } from '../../Placeholder'

class Countervalue extends PureComponent<{
  histo: {
    history: BalanceHistoryWithCountervalue,
    countervalueAvailable: boolean,
  },
  account: Account,
}> {
  render() {
    const { histo, account } = this.props
    const balanceEnd = histo.history[histo.history.length - 1].value
    return (
      <Box flex="15%">
        {histo.countervalueAvailable ? (
          <CounterValue
            currency={account.currency}
            value={balanceEnd}
            animateTicker={false}
            alwaysShowSign={false}
            showCode
            fontSize={3}
            color="graphite"
          />
        ) : (
          <PlaceholderLine width={50} />
        )}
      </Box>
    )
  }
}

export default connect(
  createStructuredSelector({
    histo: balanceHistoryWithCountervalueSelector,
  }),
)(Countervalue)
