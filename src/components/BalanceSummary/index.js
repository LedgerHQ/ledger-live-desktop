// @flow

import React, { Fragment } from 'react'
import moment from 'moment'
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
    isAvailable: boolean,
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
  // FIXME This nesting 😱
  return (
    <Card p={0} py={5}>
      <CalculateBalance accounts={accounts} daysCount={daysCount}>
        {({ isAvailable, balanceHistory, balanceStart, balanceEnd }) => (
          <Fragment>
            {renderHeader ? (
              <Box px={6}>
                {renderHeader({
                  isAvailable,
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
                color={!isAvailable ? 'rgba(0,0,0,0.04)' : chartColor}
                data={
                  isAvailable
                    ? balanceHistory
                    : balanceHistory.map(i => ({
                        ...i,
                        value:
                          10000 *
                          (1 +
                          0.1 * Math.sin(i.date * Math.cos(i.date)) + // random-ish
                            0.5 * Math.cos(i.date / 2000000000 + Math.sin(i.date / 1000000000))), // general curve trend
                      }))
                }
                height={200}
                currency={counterValue}
                tickXScale={selectedTimeRange}
                renderTickY={
                  isAvailable ? val => formatShort(counterValue.units[0], val) : () => ''
                }
                isInteractive={isAvailable}
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
                            {moment(d.date).format('L')}
                          </Box>
                        </Fragment>
                      )
                    : undefined
                }
              />
            </Box>
          </Fragment>
        )}
      </CalculateBalance>
    </Card>
  )
}

export default BalanceSummary
