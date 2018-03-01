// @flow

import React, { Fragment } from 'react'
import moment from 'moment'

import { formatCurrencyUnit, getFiatUnit } from '@ledgerhq/currencies'

import type { Accounts } from 'types/common'

import { space } from 'styles/theme'

import { AreaChart } from 'components/base/Chart'
import Box, { Card } from 'components/base/Box'
import CalculateBalance from 'components/CalculateBalance'

import BalanceInfos from './BalanceInfos'

type Props = {
  accounts: Accounts,
  selectedTime: string,
  daysCount: number,
}

const BalanceSummary = ({ accounts, selectedTime, daysCount }: Props) => (
  <Card flow={3} p={0} py={6}>
    <CalculateBalance
      accounts={accounts}
      daysCount={daysCount}
      render={({ allBalances, totalBalance, sinceBalance }) => (
        <Fragment>
          <Box px={6}>
            <BalanceInfos
              fiat="USD"
              totalBalance={totalBalance}
              since={selectedTime}
              sinceBalance={sinceBalance}
            />
          </Box>
          <Box ff="Open Sans" fontSize={4} color="graphite">
            <AreaChart
              color="#5286f7"
              data={allBalances}
              height={250}
              id="dashboard-chart"
              padding={{
                top: space[6],
                bottom: space[6],
                left: space[6] * 2,
                right: space[6],
              }}
              strokeWidth={2}
              renderLabels={d =>
                formatCurrencyUnit(getFiatUnit('USD'), d.y * 10, {
                  showCode: true,
                })
              }
              renderTickX={t => moment(t).format('MMM. D')}
            />
          </Box>
        </Fragment>
      )}
    />
  </Card>
)

export default BalanceSummary
