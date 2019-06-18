// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistoryWithCountervalueSelector } from 'actions/portfolio'
import type {
  Account,
  TokenAccount,
  BalanceHistoryWithCountervalue,
} from '@ledgerhq/live-common/lib/types'
import { getCurrencyColor } from '@ledgerhq/live-common/lib/currencies'
import Box from 'components/base/Box'
import CounterValue from 'components/CounterValue'
import Chart from 'components/base/Chart'
import DeltaChangeProvider from 'components/DeltaChangeProvider'
import FormattedVal from 'components/base/FormattedVal'

const Placeholder = styled.div`
  height: 14px;
`

class Body extends PureComponent<{
  histo: {
    history: BalanceHistoryWithCountervalue,
    countervalueAvailable: boolean,
  },
  account: Account | TokenAccount,
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
    const currency = account.type === 'Account' ? account.currency : account.token
    return (
      <Box flow={4}>
        <Box flow={2} horizontal>
          <Box justifyContent="center">
            <CounterValue
              currency={currency}
              value={history[history.length - 1].value}
              animateTicker={false}
              alwaysShowSign={false}
              showCode
              fontSize={3}
              placeholder={<Placeholder />}
              color="graphite"
            />
          </Box>
          <Box grow justifyContent="center">
            <DeltaChangeProvider from={balanceStart} to={balanceEnd}>
              {({ deltaValue }) => (
                <FormattedVal isPercent val={deltaValue} alwaysShowSign fontSize={3} />
              )}
            </DeltaChangeProvider>
          </Box>
        </Box>
        <Chart
          data={history}
          color={getCurrencyColor(currency)}
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
