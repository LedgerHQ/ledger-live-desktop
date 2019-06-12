// @flow

import React, { PureComponent } from 'react'
import { BigNumber } from 'bignumber.js'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import type { Currency, Account, TokenAccount } from '@ledgerhq/live-common/lib/types'

import type { T } from 'types/common'

import { setSelectedTimeRange } from 'actions/settings'
import type { TimeRange } from 'reducers/settings'

import { BalanceTotal, BalanceSinceDiff, BalanceSincePercent } from 'components/BalanceInfos'
import Box, { Tabbable } from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import Price from 'components/Price'
import PillsDaysCount from 'components/PillsDaysCount'
import styled from 'styled-components'
import Swap from '../../icons/Swap'

type Props = {
  isAvailable: boolean,
  first: {
    date: Date,
    value: BigNumber,
    countervalue: BigNumber,
  },
  last: {
    date: Date,
    value: BigNumber,
    countervalue: BigNumber,
  },
  counterValue: Currency,
  t: T,
  account: Account | TokenAccount,
  setSelectedTimeRange: TimeRange => *,
  selectedTimeRange: TimeRange,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
}

const Wrapper = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: row;
`

const SwapButton = styled(Tabbable).attrs({
  color: 'dark',
  ff: 'Museo Sans',
  fontSize: 7,
})`
  align-items: center;
  align-self: center;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.fog};
  color: ${p => p.theme.colors.fog};
  cursor: pointer;
  display: flex;
  height: 49px;
  justify-content: center;
  margin-right: 12px;
  margin-top: 2px;
  width: 25px;

  &:hover {
    border-color: ${p => p.theme.colors.dark};
    color: ${p => p.theme.colors.dark};
  }

  &:active {
    opacity: 0.5;
  }
`

const mapDispatchToProps = {
  setSelectedTimeRange,
}

class AccountBalanceSummaryHeader extends PureComponent<Props> {
  handleChangeSelectedTime = item => {
    this.props.setSelectedTimeRange(item.key)
  }

  render() {
    const {
      account,
      t,
      counterValue,
      selectedTimeRange,
      isAvailable,
      first,
      last,
      countervalueFirst,
      setCountervalueFirst,
    } = this.props

    const currency = account.type === 'Account' ? account.currency : account.token
    const unit = account.type === 'Account' ? account.unit : currency.units[0]
    const cvUnit = counterValue.units[0]
    const data = [
      { oldBalance: first.value, balance: last.value, unit },
      { oldBalance: first.countervalue, balance: last.countervalue, unit: cvUnit },
    ]
    if (countervalueFirst) {
      data.reverse()
    }

    const primaryKey = data[0].unit.code
    const secondaryKey = data[1].unit.code

    return (
      <Box flow={4} mb={2}>
        <Box horizontal>
          <SwapButton onClick={() => setCountervalueFirst(!countervalueFirst)}>
            <Swap />
          </SwapButton>
          <BalanceTotal
            key={primaryKey}
            style={{
              cursor: 'pointer',
              overflow: 'hidden',
              flexShrink: 1,
            }}
            onClick={() => setCountervalueFirst(!countervalueFirst)}
            showCryptoEvenIfNotAvailable
            isAvailable={isAvailable}
            totalBalance={data[0].balance}
            unit={data[0].unit}
          >
            <Wrapper>
              <div style={{ width: 'auto', marginRight: 8 }}>
                <FormattedVal
                  key={secondaryKey}
                  animateTicker
                  disableRounding
                  alwaysShowSign={false}
                  color="warmGrey"
                  unit={data[1].unit}
                  fontSize={6}
                  showCode
                  val={data[1].balance}
                />
              </div>
              <Price
                unit={unit}
                from={currency}
                withActivityCurrencyColor
                withEquality
                color="warmGrey"
                fontSize={4}
              />
            </Wrapper>
          </BalanceTotal>
          <Box>
            <PillsDaysCount selected={selectedTimeRange} onChange={this.handleChangeSelectedTime} />
          </Box>
        </Box>
        <Box key={primaryKey} horizontal justifyContent="center" flow={7}>
          <BalanceSincePercent
            isAvailable={isAvailable}
            t={t}
            alignItems="center"
            totalBalance={data[0].balance}
            sinceBalance={data[0].oldBalance}
            refBalance={data[0].oldBalance}
            since={selectedTimeRange}
          />
          <BalanceSinceDiff
            isAvailable={isAvailable}
            t={t}
            unit={data[0].unit}
            alignItems="center"
            totalBalance={data[0].balance}
            sinceBalance={data[0].oldBalance}
            refBalance={data[0].oldBalance}
            since={selectedTimeRange}
          />
        </Box>
      </Box>
    )
  }
}

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(), // FIXME t() is not even needed directly here. should be underlying component responsability to inject it
)(AccountBalanceSummaryHeader)
