// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { setExchangePairsAction } from 'actions/settings'
import ExchangeSelect from 'components/SelectExchange'
import Box from 'components/base/Box'
import { PlaceholderLine } from 'components/Placeholder'
import styled from 'styled-components'
import PriceGraph from './PriceGraph'
import Price from '../../../../Price'
import Ellipsis from '../../../../base/Ellipsis'

type Props = {
  from: Currency,
  to: Currency,
  exchange: ?string,
  setExchangePairsAction: any => void,
}

export const RateRowWrapper = styled.div`
  flex-direction: row;
  margin: 0px 24px;
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${p => p.theme.colors.lightFog};
  &:last-of-type {
    border: none;
  }
  &:first-of-type {
    height: 65px;
  }

  > * {
    flex: 1;
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
    const { from, to, exchange } = this.props
    return (
      <RateRowWrapper>
        <Box ff="Museo Sans|Regular" horizontal alignItems="center" color="dark" fontSize={4}>
          <RateTypeBar currencyType={to.type} />
          <Trans i18nKey="settings.rates.fromTo" values={{ from: from.ticker, to: to.ticker }} />
        </Box>
        <div>
          <Ellipsis>
            <Price
              withEquality
              withActivityColor="wallet"
              from={from}
              to={to}
              color="graphite"
              fontSize={3}
              placeholder={<PlaceholderLine width={16} height={2} />}
            />
          </Ellipsis>
        </div>
        <div>
          <PriceGraph from={from} to={to} width={150} height={40} exchange={exchange} days={30} />
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
