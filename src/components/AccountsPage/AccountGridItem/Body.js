// @flow

import React, { PureComponent } from 'react'
import styled, { withTheme } from 'styled-components'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistoryWithCountervalueSelector } from 'actions/portfolio'
import type { Account, TokenAccount, AccountPortfolio } from '@ledgerhq/live-common/lib/types'
import { getCurrencyColor } from 'helpers/getCurrencyColor'
import { getAccountCurrency } from '@ledgerhq/live-common/lib/account'
import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import CounterValue from 'components/CounterValue'
import Chart from 'components/base/Chart'

const Placeholder = styled.div`
  height: 14px;
`

class Body extends PureComponent<{
  histo: AccountPortfolio,
  account: Account | TokenAccount,
  theme: any,
}> {
  // $FlowFixMe
  mapValueCounterValue = d => d.countervalue.toNumber()
  mapValue = d => d.value.toNumber()

  render() {
    const {
      histo: { history, countervalueAvailable, countervalueChange },
      account,
      theme,
    } = this.props
    const currency = getAccountCurrency(account)
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
              color="palette.text.shade80"
            />
          </Box>
          <Box grow justifyContent="center">
            {!countervalueChange.percentage ? null : (
              <FormattedVal
                isPercent
                val={countervalueChange.percentage.times(100).integerValue()}
                alwaysShowSign
                fontSize={3}
              />
            )}
          </Box>
        </Box>
        <Chart
          data={history}
          color={getCurrencyColor(currency, theme.colors.palette.background.paper)}
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

export default withTheme(
  connect(
    createStructuredSelector({
      histo: balanceHistoryWithCountervalueSelector,
    }),
  )(Body),
)
