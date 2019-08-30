// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { BigNumber } from 'bignumber.js'
import { formatShort } from '@ledgerhq/live-common/lib/currencies'
import type {
  CryptoCurrency,
  Currency,
  PortfolioRange,
  TokenCurrency,
  Unit,
} from '@ledgerhq/live-common/lib/types'

import Chart from 'components/base/Chart'
import Box, { Card } from 'components/base/Box'
import moment from 'moment'
import FormattedVal from 'components/base/FormattedVal'
import { createStructuredSelector } from 'reselect'
import { currencyPortfolioSelector } from 'actions/portfolio'
import AssetBalanceSummaryHeader from './AssetBalanceSummaryHeader'

type Props = {
  counterValue: Currency,
  chartColor: string,
  chartId: string,
  currency: CryptoCurrency | TokenCurrency,
  unit: Unit,
  range: PortfolioRange,
  countervalueFirst: boolean,
  portfolio: *,
}

const mapStateToProps = createStructuredSelector({
  portfolio: currencyPortfolioSelector,
})

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

class BalanceSummary extends PureComponent<Props> {
  // $FlowFixMe
  mapValueCounterValue = d => d.countervalue.toNumber()
  mapValueCryptoValue = d => d.value.toNumber()
  renderTickY = val => formatShort(this.props.counterValue.units[0], BigNumber(val))
  renderTooltip = d => <Tooltip d={d} counterValue={this.props.counterValue} />

  render() {
    const {
      range,
      chartColor,
      chartId,
      countervalueFirst,
      portfolio,
      counterValue,
      currency,
      unit,
    } = this.props
    const displayCountervalue = countervalueFirst
    return (
      <Card p={0} py={5}>
        <Box px={6}>
          <AssetBalanceSummaryHeader
            currency={currency}
            unit={unit}
            counterValue={counterValue}
            selectedTimeRange={range}
            countervalueChange={portfolio.countervalueChange}
            cryptoChange={portfolio.cryptoChange}
            last={portfolio.history[portfolio.history.length - 1]}
            isAvailable={portfolio.countervalueAvailable}
            countervalueFirst={displayCountervalue}
          />
        </Box>

        <Box ff="Open Sans" fontSize={4} color="graphite" pt={6}>
          <Chart
            id={chartId}
            color={chartColor}
            data={portfolio.history}
            height={200}
            tickXScale={range}
            mapValue={displayCountervalue ? this.mapValueCounterValue : this.mapValueCryptoValue}
            renderTickY={this.renderTickY}
            isInteractive
            renderTooltip={this.renderTooltip}
          />
        </Box>
      </Card>
    )
  }
}

export default connect(mapStateToProps)(BalanceSummary)
