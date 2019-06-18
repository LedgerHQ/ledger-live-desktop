// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistoryWithCountervalueSelector } from 'actions/portfolio'
import type { BalanceHistoryWithCountervalue } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import DeltaChangeProvider from 'components/DeltaChangeProvider'
import FormattedVal from 'components/base/FormattedVal'

class Delta extends PureComponent<{
  histo: { history: BalanceHistoryWithCountervalue },
}> {
  render() {
    const {
      histo: { history },
    } = this.props
    const balanceStart = history[0].countervalue
    const balanceEnd = history[history.length - 1].countervalue
    return (
      <Box flex="10%" justifyContent="flex-end">
        <DeltaChangeProvider from={balanceStart} to={balanceEnd}>
          {({ deltaValue }) => (
            <FormattedVal val={deltaValue} isPercent alwaysShowSign fontSize={3} />
          )}
        </DeltaChangeProvider>
      </Box>
    )
  }
}

export default connect(
  createStructuredSelector({
    histo: balanceHistoryWithCountervalueSelector,
  }),
)(Delta)
