// @flow

import React from 'react'
import { getIconByCoinType } from '@ledgerhq/currencies/react'

import type { Account } from 'types/common'

import { SimpleAreaChart } from 'components/base/Chart'
import Bar from 'components/base/Bar'
import Box, { Card } from 'components/base/Box'
import CalculateBalance from 'components/CalculateBalance'
import FormattedVal from 'components/base/FormattedVal'

const AccountCard = ({
  account,
  onClick,
  daysCount,
}: {
  account: Account,
  onClick: Function,
  daysCount: number,
}) => {
  const Icon = getIconByCoinType(account.currency.coinType)

  return (
    <Card p={4} flex={1} style={{ cursor: 'pointer' }} onClick={onClick}>
      <Box flow={4}>
        <Box horizontal ff="Open Sans|SemiBold" flow={3} alignItems="center">
          <Box
            alignItems="center"
            justifyContent="center"
            style={{ color: account.currency.color }}
          >
            {Icon && <Icon size={20} />}
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
        <Bar size={1} color="argile" />
        <Box justifyContent="center">
          <FormattedVal
            alwaysShowSign={false}
            color="dark"
            unit={account.unit}
            showCode
            val={account.balance}
            style={{
              lineHeight: 1,
            }}
          />
        </Box>
      </Box>
      <CalculateBalance
        accounts={[account]}
        daysCount={daysCount}
        render={({ allBalances, totalBalance, sinceBalance }) => (
          <Box flow={4}>
            <Box flow={2} horizontal>
              <Box justifyContent="center">
                <FormattedVal
                  fiat="USD"
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
                  val={Math.floor((totalBalance - sinceBalance) / sinceBalance * 100)}
                  alwaysShowSign
                  fontSize={3}
                />
              </Box>
            </Box>
            <SimpleAreaChart
              data={allBalances}
              color={account.currency.color}
              height={52}
              id={`account-chart-${account.id}`}
              linearGradient={[[5, 0.2], [75, 0]]}
              simple
              strokeWidth={1.5}
            />
          </Box>
        )}
      />
    </Card>
  )
}

export default AccountCard
