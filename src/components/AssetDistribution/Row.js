// @flow

import React, { Fragment, PureComponent } from 'react'
import type { CryptoCurrency, TokenCurrency } from '@ledgerhq/live-common/lib/types/currencies'
import { getCurrencyColor } from 'helpers/getCurrencyColor'
import { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import styled, { withTheme } from 'styled-components'
import { push } from 'react-router-redux'
import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'
import Price from 'components/Price'
import Text from 'components/base/Text'
import Ellipsis from 'components/base/Ellipsis'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Bar from './Bar'

export type DistributionItem = {
  currency: CryptoCurrency | TokenCurrency,
  distribution: number, // % of the total (normalized in 0-1)
  amount: BigNumber,
  countervalue: BigNumber, // countervalue of the amount that was calculated based of the rate provided
}

type Props = {
  item: DistributionItem,
  push: typeof push,
  theme: any,
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
    box-sizing: border-box;
  }

  cursor: pointer;

  &:hover {
    background: ${p => p.theme.colors.palette.background.default};
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
const PriceSection = styled.div`
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
  box-sizing: border-box;
  padding-left: 8px;
  text-align: right;
`

const mapDispatchToProps = {
  push,
}

class Row extends PureComponent<Props, State> {
  render() {
    const {
      item: { currency, amount, distribution },
      theme,
    } = this.props
    const color = getCurrencyColor(currency, theme.colors.palette.background.paper)
    const percentage = (Math.floor(distribution * 10000) / 100).toFixed(2)
    const icon = <CryptoCurrencyIcon currency={currency} size={16} />
    return (
      <Wrapper onClick={() => this.props.push(`/asset/${currency.id}`)}>
        <Asset>
          {icon}
          <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
            {currency.name}
          </Ellipsis>
        </Asset>
        <PriceSection>
          {distribution ? (
            <Price from={currency} color="palette.text.shade80" fontSize={3} />
          ) : (
            <Text ff="Inter" color="palette.text.shade100" fontSize={3}>
              {'-'}
            </Text>
          )}
        </PriceSection>
        <Distribution>
          {!!distribution && (
            <Fragment>
              <Text ff="Inter" color="palette.text.shade100" fontSize={3}>
                {`${percentage}%`}
              </Text>
              <Bar progress={percentage} progressColor={color} />
            </Fragment>
          )}
        </Distribution>
        <Amount>
          <Ellipsis>
            <FormattedVal
              color={'palette.text.shade80'}
              unit={currency.units[0]}
              val={amount}
              fontSize={3}
              showCode
            />
          </Ellipsis>
        </Amount>
        <Value>
          <Ellipsis>
            {distribution ? (
              <CounterValue
                currency={currency}
                value={amount}
                disableRounding
                color="palette.text.shade100"
                fontSize={3}
                showCode
                alwaysShowSign={false}
              />
            ) : (
              <Text ff="Inter" color="palette.text.shade100" fontSize={3}>
                {'-'}
              </Text>
            )}
          </Ellipsis>
        </Value>
      </Wrapper>
    )
  }
}

export default withTheme(
  connect(
    null,
    mapDispatchToProps,
  )(Row),
)
