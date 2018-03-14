// @flow

import React, { Fragment } from 'react'

import { getFiatUnit } from '@ledgerhq/currencies'

import type { Account } from 'types/common'

import Chart from 'components/base/NewChart'
import Box, { Card } from 'components/base/Box'
import CalculateBalance from 'components/CalculateBalance'
import FormattedVal from 'components/base/FormattedVal'

type Props = {
  counterValue: string,
  chartColor: string,
  chartId: string,
  accounts: Account[],
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
            <Box ff="Open Sans" fontSize={4} color="graphite" pt={6}>
              <Chart
                id={chartId}
                color={chartColor}
                data={allBalances}
                height={250}
                unit={unit}
                tickXScale={selectedTime}
                renderTooltip={d => (
                  <FormattedVal
                    alwaysShowSign={false}
                    color="white"
                    showCode
                    fiat={counterValue}
                    val={d.value}
                  />
                )}
              />
            </Box>
          </Fragment>
        )}
      />
    </Card>
  )
}

export default BalanceSummary
