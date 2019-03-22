// @flow

import React, { PureComponent } from 'react'
import { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { setExchangePairsAction } from 'actions/settings'
import ExchangeSelect from 'components/SelectExchange'
import Box from 'components/base/Box'
import { SettingsSectionRowContainer } from '../SettingsSection'
import Price from './Price'
import PriceGraph from './PriceGraph'

type Props = {
  from: Currency,
  to: Currency,
  exchangeId: ?string,
  setExchangePairsAction: *,
}

class RateRow extends PureComponent<Props> {
  handleChangeExchange = exchange => {
    const { from, to } = this.props
    this.props.setExchangePairsAction([
      {
        from,
        to,
        exchange: exchange && exchange.id,
      },
    ])
  }
  render() {
    const { from, to, exchangeId } = this.props
    return (
      <SettingsSectionRowContainer>
        <Box ff="Open Sans|SemiBold" color="dark" fontSize={4}>
          {`${from.ticker} → ${to.ticker}`}
        </Box>
        <Price
          from={from}
          to={to}
          value={new BigNumber(10).pow(from.units[0].magnitude)}
          exchange={exchangeId}
        />
        <PriceGraph from={from} to={to} exchange={exchangeId} width={100} height={30} days={30} />
        <ExchangeSelect
          small
          from={from}
          to={to}
          exchangeId={exchangeId}
          onChange={this.handleChangeExchange}
          minWidth={200}
        />
      </SettingsSectionRowContainer>
    )
  }
}

export default connect(
  null,
  {
    setExchangePairsAction,
  },
)(RateRow)
