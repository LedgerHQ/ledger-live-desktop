// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { balanceHistoryWithCountervalueSelector } from 'actions/portfolio'
import { BigNumber } from 'bignumber.js'
import moment from 'moment'
import { formatShort } from '@ledgerhq/live-common/lib/currencies'
import type {
  Currency,
  Account,
  TokenAccount,
  PortfolioRange,
  AccountPortfolio,
} from '@ledgerhq/live-common/lib/types'

import Chart from 'components/base/Chart'
import Box, { Card } from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import AccountBalanceSummaryHeader from './AccountBalanceSummaryHeader'

type Props = {
  counterValue: Currency,
  chartColor: string,
  chartId: string,
  account: Account | TokenAccount,
  parentAccount: ?Account,
  balanceHistoryWithCountervalue: AccountPortfolio,
  range: PortfolioRange,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
}

class AccountBalanceSummary extends PureComponent<Props> {
  renderTooltip = d => {
    const { account, counterValue, balanceHistoryWithCountervalue, countervalueFirst } = this.props
    const displayCountervalue =
      countervalueFirst && balanceHistoryWithCountervalue.countervalueAvailable
    const unit = account.type === 'Account' ? account.unit : account.token.units[0]
    const data = [{ val: d.value, unit }, { val: d.countervalue, unit: counterValue.units[0] }]
    if (displayCountervalue) data.reverse()
    return (
      <Fragment>
        <FormattedVal fontSize={5} color="dark" showCode {...data[0]} />
        <FormattedVal fontSize={4} color="warmGrey" showCode {...data[1]} />
        <Box ff="Open Sans|Regular" color="grey" fontSize={3} mt={2}>
          {moment(d.date).format('LL')}
        </Box>
      </Fragment>
    )
  }

  renderTickYCryptoValue = val => {
    const { account } = this.props
    const unit = account.type === 'Account' ? account.unit : account.token.units[0]
    return formatShort(unit, BigNumber(val))
  }

  renderTickYCounterValue = val => formatShort(this.props.counterValue.units[0], BigNumber(val))

  // $FlowFixMe
  mapValueCounterValue = d => d.countervalue.toNumber()

  mapValueCryptoValue = d => d.value.toNumber()

  render() {
    const {
      account,
      balanceHistoryWithCountervalue: {
        history,
        countervalueAvailable,
        countervalueChange,
        cryptoChange,
      },
      range,
      chartColor,
      chartId,
      counterValue,
      countervalueFirst,
      setCountervalueFirst,
    } = this.props
    const displayCountervalue = countervalueFirst && countervalueAvailable
    return (
      <Card p={0} py={5}>
        <Box px={6}>
          <AccountBalanceSummaryHeader
            account={account}
            counterValue={counterValue}
            selectedTimeRange={range}
            countervalueChange={countervalueChange}
            cryptoChange={cryptoChange}
            last={history[history.length - 1]}
            isAvailable={countervalueAvailable}
            countervalueFirst={displayCountervalue}
            setCountervalueFirst={setCountervalueFirst}
          />
        </Box>

        <Box ff="Open Sans" fontSize={4} color="graphite" pt={5}>
          <Chart
            id={chartId}
            color={chartColor}
            data={history}
            height={200}
            tickXScale={range}
            mapValue={displayCountervalue ? this.mapValueCounterValue : this.mapValueCryptoValue}
            renderTickY={
              displayCountervalue ? this.renderTickYCounterValue : this.renderTickYCryptoValue
            }
            isInteractive
            renderTooltip={this.renderTooltip}
          />
        </Box>
      </Card>
    )
  }
}

export default connect(
  createStructuredSelector({
    balanceHistoryWithCountervalue: balanceHistoryWithCountervalueSelector,
  }),
)(AccountBalanceSummary)
