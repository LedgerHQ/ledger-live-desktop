// @flow

import React, { PureComponent } from 'react'
import type { CryptoCurrency, TokenCurrency } from '@ledgerhq/live-common/lib/types/currencies'
import { BigNumber } from 'bignumber.js'
import styled from 'styled-components'
import { colors } from 'styles/theme'
import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'
import IconActivity from 'icons/Activity'
import CryptoCurrencyIcon from '../CryptoCurrencyIcon'
import Bar from './Bar'
import Ellipsis from '../base/Ellipsis'

export type DistributionItem = {
  currency: CryptoCurrency | TokenCurrency,
  distribution: number, // % of the total (normalized in 0-1)
  amount: BigNumber,
  countervalue: BigNumber, // countervalue of the amount that was calculated based of the rate provided
}

type Props = {
  item: DistributionItem,
}

type State = {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
  > * {
    display: flex;
    align-items: center;
    flex-direction: row;
    border: 1 px solid red;
    box-sizing: border-box;
  }
`

const Asset = styled.div`
  width: 20%;
  > :first-child {
    margin-right: 10px;
  }
  > :nth-child(2) {
    margin-right: 8px;
  }
`
const Price = styled.div`
  width: 20%;
  text-align: left;
  > :first-child {
    margin-right: 6px;
  }
`
const Distribution = styled.div`
  width: 20%;
  text-align: right;
  > :first-child {
    margin-right: 11px;
    width: 40px; //max width for a 99.99% case
    text-align: right;
  }
`
const Amount = styled.div`
  width: 25%;
  text-align: right;
`
const Value = styled.div`
  width: 15%;
  text-align: right;
`

class Row extends PureComponent<Props, State> {
  render() {
    const {
      item: { currency, amount, distribution },
    } = this.props
    const one = new BigNumber(10 ** currency.units[0].magnitude)
    // $FlowFixMe
    const color = currency.color || colors.live
    const percentage = (Math.floor(distribution * 10000) / 100).toFixed(2)
    const icon = <CryptoCurrencyIcon currency={currency} size={16} />
    return (
      <Wrapper>
        <Asset>
          {icon}
          <Ellipsis ff="Open Sans|SemiBold" color="dark" fontSize={3}>
            {currency.name}
          </Ellipsis>
        </Asset>
        <Price>
          <IconActivity size={12} color={colors.graphite} />
          <CounterValue
            currency={currency}
            value={one}
            disableRounding
            color="graphite"
            fontSize={3}
            showCode
            alwaysShowSign={false}
          />
        </Price>
        <Distribution>
          <Text ff="Rubik" color="dark" fontSize={3}>
            {`${percentage}%`}
          </Text>
          <Bar progress={percentage} progressColor={color} />
        </Distribution>
        <Amount>
          <Ellipsis>
            <FormattedVal
              color={'graphite'}
              unit={currency.units[0]}
              val={amount}
              fontSize={3}
              showCode
              disableRounding
            />
          </Ellipsis>
        </Amount>
        <Value>
          <Ellipsis>
            <CounterValue
              currency={currency}
              value={amount}
              disableRounding
              color="graphite"
              fontSize={3}
              showCode
              alwaysShowSign={false}
            />
          </Ellipsis>
        </Value>
      </Wrapper>
    )
  }
}

export default Row
