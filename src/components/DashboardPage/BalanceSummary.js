// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { portfolioSelector } from 'actions/portfolio'
import { BigNumber } from 'bignumber.js'
import moment from 'moment'
import { formatShort } from '@ledgerhq/live-common/lib/currencies'
import type { Currency, PortfolioRange, Portfolio } from '@ledgerhq/live-common/lib/types'

import Chart from 'components/base/Chart'
import Box, { Card } from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import PlaceholderChart from 'components/PlaceholderChart'

type Props = {|
  counterValue: Currency,
  chartColor: string,
  chartId: string,
  portfolio: Portfolio,
  range: PortfolioRange,
  Header?: React$ComponentType<{ portfolio: Portfolio }>,
|}

const Tooltip = ({ counterValue, d }: *) => (
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
      {moment(d.date).format('LL')}
    </Box>
  </Fragment>
)

class PortfolioBalanceSummary extends PureComponent<Props> {
  renderTickY = val => formatShort(this.props.counterValue.units[0], BigNumber(val))

  renderTooltip = d => <Tooltip d={d} counterValue={this.props.counterValue} />

  render() {
    const { portfolio, range, chartColor, chartId, Header } = this.props
    return (
      <Card p={0} py={5}>
        {Header ? (
          <Box px={6} data-e2e="dashboard_graph">
            <Header portfolio={portfolio} />
          </Box>
        ) : null}

        <Box ff="Open Sans" fontSize={4} color="graphite" pt={5}>
          {portfolio.balanceAvailable ? (
            <Chart
              onlyUpdateIfLastPointChanges
              id={chartId}
              color={chartColor}
              data={portfolio.balanceHistory}
              height={200}
              tickXScale={range}
              renderTickY={this.renderTickY}
              isInteractive
              renderTooltip={this.renderTooltip}
            />
          ) : (
            <PlaceholderChart
              chartId={chartId}
              data={portfolio.balanceHistory}
              tickXScale={range}
            />
          )}
        </Box>
      </Card>
    )
  }
}

export default connect(
  createStructuredSelector({
    portfolio: portfolioSelector,
  }),
)(PortfolioBalanceSummary)
