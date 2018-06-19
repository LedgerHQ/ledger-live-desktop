// @flow

import React, { Fragment } from 'react'
import { formatShort } from '@ledgerhq/live-common/lib/helpers/currencies'
import type { Currency, Account } from '@ledgerhq/live-common/lib/types'

import Chart from 'components/base/Chart'
import Box, { Card } from 'components/base/Box'
import CalculateBalance from 'components/CalculateBalance'
import FormattedVal from 'components/base/FormattedVal'

type Props = {
  counterValue: Currency,
  chartColor: string,
  chartId: string,
  accounts: Account[],
  selectedTimeRange: string,
  daysCount: number,
  renderHeader?: ({
    selectedTimeRange: *,
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
  renderHeader,
  selectedTimeRange,
}: Props) => {
  const account = accounts.length === 1 ? accounts[0] : undefined
  return (
    <Card p={0} py={5}>
      <CalculateBalance accounts={accounts} daysCount={daysCount}>
        {({ isAvailable, balanceHistory, balanceStart, balanceEnd }) =>
          !isAvailable ? null : (
            <Fragment>
              {renderHeader ? (
                <Box px={6}>
                  {renderHeader({
                    selectedTimeRange,
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
                  unit={account ? account.unit : null}
                  color={chartColor}
                  data={balanceHistory}
                  height={200}
                  currency={counterValue}
                  tickXScale={selectedTimeRange}
                  renderTickY={val => formatShort(counterValue.units[0], val)}
                  renderTooltip={
                    isAvailable && !account
                      ? d => (
                          <Fragment>
                            <FormattedVal
                              alwaysShowSign={false}
                              fontSize={5}
                              color="dark"
                              showCode
                              unit={counterValue.units[0]}
                              val={d.value}
                            />
                            <Box ff="Open Sans|Regular" color="grey" fontSize={3} mt={2}>
                              {d.date.toISOString().substr(0, 10)}
                            </Box>
                          </Fragment>
                        )
                      : undefined
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
