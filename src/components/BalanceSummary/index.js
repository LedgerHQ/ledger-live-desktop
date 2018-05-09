// @flow

import React, { Fragment } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { getFiatCurrencyByTicker } from '@ledgerhq/live-common/lib/helpers/currencies'

import Chart from 'components/base/Chart'
import Box, { Card } from 'components/base/Box'
import CalculateBalance from 'components/CalculateBalance'
import FormattedVal from 'components/base/FormattedVal'

type Props = {
  onCalculate: Function,
  counterValue: string,
  chartColor: string,
  chartId: string,
  accounts: Account[],
  selectedTime: string,
  daysCount: number,
  renderHeader?: ({
    selectedTime: *,
    totalBalance: number,
    sinceBalance: number,
    refBalance: number,
  }) => *,
}

const BalanceSummary = ({
  accounts,
  chartColor,
  chartId,
  counterValue,
  daysCount,
  onCalculate,
  renderHeader,
  selectedTime,
}: Props) => {
  const unit = getFiatCurrencyByTicker(counterValue).units[0]
  return (
    <Card p={0} py={6}>
      <CalculateBalance
        accounts={accounts}
        counterValue={counterValue}
        daysCount={daysCount}
        onCalculate={onCalculate}
      >
        {({ isAvailable, balanceHistory, balanceStart, balanceEnd }) =>
          !isAvailable ? null : (
            <Fragment>
              {renderHeader ? (
                <Box px={6}>
                  {renderHeader({
                    selectedTime,
                    // FIXME refactor these
                    totalBalance: balanceEnd,
                    sinceBalance: balanceStart,
                    refBalance: balanceStart,
                  })}
                </Box>
              ) : null}
              <Box ff="Open Sans" fontSize={4} color="graphite" pt={6}>
                <Chart
                  id={chartId}
                  color={chartColor}
                  data={balanceHistory}
                  height={250}
                  unit={unit}
                  tickXScale={selectedTime}
                  renderTooltip={d =>
                    isAvailable ? (
                      <FormattedVal
                        alwaysShowSign={false}
                        color="white"
                        showCode
                        fiat={counterValue}
                        val={d.value}
                      />
                    ) : null
                  }
                />
              </Box>
            </Fragment>
          )
        }
      </CalculateBalance>
    </Card>
  )
}

export default BalanceSummary
