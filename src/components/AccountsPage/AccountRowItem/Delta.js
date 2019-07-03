// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistoryWithCountervalueSelector } from 'actions/portfolio'
import type { AccountPortfolio } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import { PlaceholderLine } from '../../Placeholder'

class Delta extends PureComponent<{
  histo: AccountPortfolio,
}> {
  render() {
    const {
      histo: { countervalueChange },
    } = this.props
    return (
      <Box flex="10%" justifyContent="flex-end">
        {!countervalueChange.percentage ? (
          <PlaceholderLine width={16} height={2} />
        ) : (
          <FormattedVal
            isPercent
            val={countervalueChange.percentage.times(100).integerValue()}
            alwaysShowSign
            fontSize={3}
          />
        )}
      </Box>
    )
  }
}

export default connect(
  createStructuredSelector({
    histo: balanceHistoryWithCountervalueSelector,
  }),
)(Delta)
