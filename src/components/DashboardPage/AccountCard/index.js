// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import type { Account, Currency } from '@ledgerhq/live-common/lib/types'

import Chart from 'components/base/Chart'
import Bar from 'components/base/Bar'
import Box, { Card } from 'components/base/Box'
import CalculateBalance from 'components/CalculateBalance'
import FormattedVal from 'components/base/FormattedVal'
import DeltaChange from 'components/DeltaChange'
import { DISABLE_GRAPHS } from 'config/constants'
import AccountCardHeader from './Header'

const Wrapper = styled(Card).attrs({
  p: 4,
  flex: 1,
})`
  cursor: ${p => (p.onClick ? 'pointer' : 'default')};
`

class AccountCard extends PureComponent<{
  counterValue: Currency,
  account: Account,
  onClick: Account => void,
  daysCount: number,
}> {
  renderBody = ({ isAvailable, balanceHistory, balanceStart, balanceEnd }: *) => {
    const { counterValue, account } = this.props
    return (
      <Box flow={4}>
        <Box flow={2} horizontal>
          <Box justifyContent="center">
            {isAvailable ? (
              <FormattedVal
                animateTicker
                unit={counterValue.units[0]}
                val={balanceEnd}
                alwaysShowSign={false}
                showCode
                fontSize={3}
                color="graphite"
              />
            ) : null}
          </Box>
          <Box grow justifyContent="center">
            {isAvailable && !balanceStart.isZero() ? (
              <DeltaChange from={balanceStart} to={balanceEnd} alwaysShowSign fontSize={3} />
            ) : null}
          </Box>
        </Box>
        {DISABLE_GRAPHS ? null : (
          <Chart
            data={balanceHistory}
            color={account.currency.color}
            height={52}
            hideAxis
            isInteractive={false}
            id={`account-chart-${account.id}`}
            unit={account.unit}
          />
        )}
      </Box>
    )
  }
  onClick = () => {
    const { account, onClick } = this.props
    onClick(account)
  }
  render() {
    const { counterValue, account, onClick, daysCount, ...props } = this.props
    return (
      <Wrapper onClick={this.onClick} {...props} data-e2e="dashboard_AccountCardWrapper">
        <Box flow={4}>
          <AccountCardHeader accountName={account.name} currency={account.currency} />
          <Bar size={1} color="fog" />
          <Box justifyContent="center">
            <FormattedVal
              alwaysShowSign={false}
              color="dark"
              unit={account.unit}
              showCode
              val={account.balance}
            />
          </Box>
        </Box>
        <CalculateBalance counterValue={counterValue} accounts={[account]} daysCount={daysCount}>
          {this.renderBody}
        </CalculateBalance>
      </Wrapper>
    )
  }
}

export default AccountCard
