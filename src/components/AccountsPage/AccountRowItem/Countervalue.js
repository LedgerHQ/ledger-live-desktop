// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistoryWithCountervalueSelector } from 'actions/portfolio'
import type {
  BalanceHistoryWithCountervalue,
  CryptoCurrency,
  TokenCurrency,
} from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import CounterValue from 'components/CounterValue'
import { PlaceholderLine } from '../../Placeholder'

class Countervalue extends PureComponent<{
  histo: {
    history: BalanceHistoryWithCountervalue,
    countervalueAvailable: boolean,
  },
  currency: CryptoCurrency | TokenCurrency,
}> {
  render() {
    const { histo, currency } = this.props
    const balanceEnd = histo.history[histo.history.length - 1].value
    const placeholder = <PlaceholderLine width={16} height={2} />
    return (
      <Box flex="20%">
        {histo.countervalueAvailable ? (
          <CounterValue
            currency={currency}
            value={balanceEnd}
            animateTicker={false}
            alwaysShowSign={false}
            showCode
            fontSize={3}
            color="palette.text.shade80"
            placeholder={placeholder}
          />
        ) : (
          placeholder
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
