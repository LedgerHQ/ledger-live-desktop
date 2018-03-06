// @flow

import React, { Fragment } from 'react'
import moment from 'moment'

import { formatShort, formatCurrencyUnit, getFiatUnit } from '@ledgerhq/currencies'

import type { Accounts } from 'types/common'

import { space } from 'styles/theme'

import { AreaChart } from 'components/base/Chart'
import Box, { Card } from 'components/base/Box'
import CalculateBalance from 'components/CalculateBalance'

function getTickCountX(selectedTime) {
  switch (selectedTime) {
    default:
    case 'week':
      return 7

    case 'month':
      return 10

    case 'year':
      return 13
  }
}

function renderTickX(selectedTime) {
  let format = 'MMM. D'

  if (selectedTime === 'year') {
    format = 'MMM.'
  }

  return t => moment(t).format(format)
}

type Props = {
  counterValue: string,
  chartColor: string,
  chartId: string,
  accounts: Accounts,
  selectedTime: string,
  daysCount: number,
  renderHeader: null | Function,
}

const BalanceSummary = ({
  counterValue,
  chartColor,
  chartId,
  accounts,
  selectedTime,
  daysCount,
  renderHeader,
}: Props) => {
  const unit = getFiatUnit(counterValue)
  return (
    <Card p={0} py={6}>
      <CalculateBalance
        counterValue={counterValue}
        accounts={accounts}
        daysCount={daysCount}
        render={({ allBalances, totalBalance, sinceBalance, refBalance }) => (
          <Fragment>
            {renderHeader !== null && (
              <Box px={6}>
                {renderHeader({
                  totalBalance,
                  selectedTime,
                  sinceBalance,
                  refBalance,
                })}
              </Box>
            )}
            <Box ff="Open Sans" fontSize={4} color="graphite">
              <AreaChart
                color={chartColor}
                data={allBalances}
                height={250}
                id={chartId}
                padding={{
                  top: space[6],
                  bottom: space[6],
                  left: space[6] * 2,
                  right: space[6],
                }}
                strokeWidth={2}
                renderLabels={d =>
                  formatCurrencyUnit(unit, d.y * 100, {
                    showCode: true,
                  })
                }
                renderTickX={renderTickX(selectedTime)}
                renderTickY={t => formatShort(unit, t)}
                tickCountX={getTickCountX(selectedTime)}
                tickCountY={4}
              />
            </Box>
          </Fragment>
        )}
      />
    </Card>
  )
}

export default BalanceSummary
