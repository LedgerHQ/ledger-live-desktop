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
  const currency = getFiatCurrencyByTicker(counterValue)
  const account = accounts.length === 1 ? accounts[0] : null
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
                  account={account}
                  color={chartColor}
                  data={balanceHistory}
                  height={250}
                  currency={currency}
                  tickXScale={selectedTime}
                  renderTooltip={
                    isAvailable && !account
                      ? d => (
                          <Fragment>
                            <FormattedVal
                              alwaysShowSign={false}
                              fontSize={5}
                              color="dark"
                              showCode
                              fiat={counterValue}
                              val={d.value}
                            />
                            <Box mt="auto">{d.date.toISOString().substr(0, 10)}</Box>
                          </Fragment>
                        )
                      : null
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
