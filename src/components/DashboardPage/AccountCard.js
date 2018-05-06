// @flow

import React from 'react'
import styled from 'styled-components'

import type { Account } from '@ledgerhq/live-common/lib/types'

import Chart from 'components/base/Chart'
import Bar from 'components/base/Bar'
import Box, { Card } from 'components/base/Box'
import CalculateBalance from 'components/CalculateBalance'
import FormattedVal from 'components/base/FormattedVal'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'

const Wrapper = styled(Card).attrs({
  p: 4,
  flex: 1,
})`
  cursor: ${p => (p.onClick ? 'pointer' : 'default')};
`

const AccountCard = ({
  counterValue,
  account,
  onClick,
  daysCount,
  ...props
}: {
  counterValue: string,
  account: Account,
  onClick?: Function,
  daysCount: number,
}) => (
  <Wrapper onClick={onClick} {...props}>
    <Box flow={4}>
      <Box horizontal ff="Open Sans|SemiBold" flow={3} alignItems="center">
        <Box alignItems="center" justifyContent="center" style={{ color: account.currency.color }}>
          <CryptoCurrencyIcon currency={account.currency} size={20} />
        </Box>
        <Box>
          <Box style={{ textTransform: 'uppercase' }} fontSize={0} color="graphite">
            {account.unit.code}
          </Box>
          <Box fontSize={4} color="dark">
            {account.name}
          </Box>
        </Box>
      </Box>
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
    <CalculateBalance
      counterValue={counterValue}
      accounts={[account]}
      daysCount={daysCount}
      render={({ allBalances, totalBalance, refBalance }) => (
        <Box flow={4}>
          <Box flow={2} horizontal>
            <Box justifyContent="center">
              <FormattedVal
                animateTicker
                fiat={counterValue}
                val={totalBalance}
                alwaysShowSign={false}
                showCode
                fontSize={3}
                color="graphite"
              />
            </Box>
            <Box grow justifyContent="center">
              <FormattedVal
                isPercent
                val={Math.floor((totalBalance - refBalance) / refBalance * 100)}
                alwaysShowSign
                fontSize={3}
              />
            </Box>
          </Box>
          <Chart
            data={allBalances}
            color={account.currency.color}
            height={52}
            hideAxis
            interactive={false}
            id={`account-chart-${account.id}`}
            unit={account.unit}
          />
        </Box>
      )}
    />
  </Wrapper>
)

AccountCard.defaultProps = {
  onClick: undefined,
}

export default AccountCard
