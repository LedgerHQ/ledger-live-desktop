// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import styled from 'styled-components'
import type { Currency, ValueChange, Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { getAccountCurrency, getAccountUnit } from '@ledgerhq/live-common/lib/account'
import type { TimeRange } from 'reducers/settings'
import { setSelectedTimeRange } from 'actions/settings'
import { BalanceTotal, BalanceDiff } from 'components/BalanceInfos'
import Box, { Tabbable } from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import Price from 'components/Price'
import PillsDaysCount from 'components/PillsDaysCount'
import Swap from '../../icons/Swap'

type Props = {
  isAvailable: boolean,
  cryptoChange: ValueChange,
  countervalueChange: ValueChange,
  last: {
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

const SwapButton = styled(Tabbable).attrs(() => ({
  color: 'palette.text.shade100',
  ff: 'Inter',
  fontSize: 7,
}))`
  align-items: center;
  align-self: center;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade20};
  color: ${p => p.theme.colors.palette.text.shade20};
  cursor: pointer;
  display: flex;
  height: 53px;
  justify-content: center;
  margin-right: 16px;
  width: 25px;

  &:hover {
    border-color: ${p => p.theme.colors.palette.text.shade100};
    color: ${p => p.theme.colors.palette.text.shade100};
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
      cryptoChange,
      last,
      countervalueChange,
      countervalueFirst,
      setCountervalueFirst,
    } = this.props

    const currency = getAccountCurrency(account)
    const unit = getAccountUnit(account)
    const cvUnit = counterValue.units[0]
    const data = [
      { valueChange: cryptoChange, balance: last.value, unit },
      { valueChange: countervalueChange, balance: last.countervalue, unit: cvUnit },
    ]
    if (countervalueFirst) {
      data.reverse()
    }

    const primaryKey = data[0].unit.code
    const secondaryKey = data[1].unit.code

    return (
      <Box flow={5}>
        <Box horizontal>
          {isAvailable && (
            <SwapButton onClick={() => setCountervalueFirst(!countervalueFirst)}>
              <Swap />
            </SwapButton>
          )}
          <BalanceTotal
            key={primaryKey}
            style={{
              cursor: isAvailable ? 'pointer' : '',
              overflow: 'hidden',
              flexShrink: 1,
            }}
            onClick={() => setCountervalueFirst(!countervalueFirst)}
            showCryptoEvenIfNotAvailable
            isAvailable={isAvailable}
            totalBalance={data[0].balance}
            unit={data[0].unit}
          >
            <Wrapper style={{ marginTop: 4 }}>
              <div style={{ width: 'auto', marginRight: 20 }}>
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
                fontSize={6}
                iconSize={16}
              />
            </Wrapper>
          </BalanceTotal>
        </Box>
        <Box
          key={primaryKey}
          horizontal
          alignItems="center"
          justifyContent={isAvailable ? 'space-between' : 'flex-end'}
          flow={7}
        >
          <BalanceDiff
            t={t}
            totalBalance={data[0].balance}
            valueChange={data[0].valueChange}
            unit={data[0].unit}
            since={selectedTimeRange}
            isAvailable={isAvailable}
          />
          <PillsDaysCount selected={selectedTimeRange} onChange={this.handleChangeSelectedTime} />
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
