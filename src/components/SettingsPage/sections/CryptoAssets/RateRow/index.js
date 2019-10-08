// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { setExchangePairsAction } from 'actions/settings'
import ExchangeSelect from 'components/SelectExchange'
import Box from 'components/base/Box'
import styled from 'styled-components'
import PriceGraph from './PriceGraph'
import Price from '../../../../Price'
import type { TimeRange } from '../../../../../reducers/settings'

type Props = {
  from: Currency,
  to: Currency,
  exchange: ?string,
  timeRange: TimeRange,
  setExchangePairsAction: any => void,
}

export const RateRowWrapper = styled.div`
  flex-direction: row;
  margin: 0px 24px;
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  &:last-of-type {
    border: none;
  }
  &:first-of-type {
    height: 65px;
  }

  > * {
    flex: 1;
    &:nth-child(1) {
      flex: 0.75;
    }
    &:nth-child(2) {
      width: 300px;
    }
    &:nth-child(4) {
      > * {
        min-width: 100px;
      }
    }
  }
`

const RateTypeBar = styled.div`
  width: 2px;
  height: 16px;
  margin-right: 8px;
  background-color: ${p =>
    p.theme.colors[p.currencyType === 'FiatCurrency' ? 'wallet' : 'identity']};
`

const NoDataContainer = styled(Box)`
  white-space: nowrap;
`

const NoData = () => (
  <NoDataContainer ff="Inter|SemiBold" color="palette.text.shade40" fontSize={4}>
    <Trans style={{ whiteSpace: 'nowrap' }} i18nKey="settings.rates.noCounterValue" />
  </NoDataContainer>
)

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
    const { from, to, exchange, timeRange } = this.props
    return (
      <RateRowWrapper>
        <Box
          ff="Inter|Regular"
          horizontal
          alignItems="center"
          color="palette.text.shade100"
          fontSize={4}
        >
          <RateTypeBar currencyType={to.type} />
          <Trans i18nKey="settings.rates.fromTo" values={{ from: from.ticker, to: to.ticker }} />
        </Box>
        <div>
          <Price
            withEquality
            from={from}
            to={to}
            color="palette.text.shade80"
            fontSize={3}
            placeholder={<NoData />}
          />
        </div>
        <div>
          <PriceGraph
            timeRange={timeRange}
            from={from}
            to={to}
            width={150}
            height={40}
            exchange={exchange}
            placeholder={null}
          />
        </div>
        <ExchangeSelect
          small
          from={from}
          to={to}
          exchangeId={exchange}
          onChange={this.handleChangeExchange}
          minWidth={200}
        />
      </RateRowWrapper>
    )
  }
}

export default connect(
  null,
  {
    setExchangePairsAction,
  },
)(RateRow)
