// @flow

import React, { PureComponent } from 'react'
import type { BigNumber } from 'bignumber.js'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import type { Currency, Account } from '@ledgerhq/live-common/lib/types'

import type { T } from 'types/common'

import { saveSettings } from 'actions/settings'
import type { TimeRange } from 'reducers/settings'

import { BalanceTotal, BalanceSinceDiff, BalanceSincePercent } from 'components/BalanceInfos'
import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import PillsDaysCount from 'components/PillsDaysCount'

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
  account: Account,
  saveSettings: ({ selectedTimeRange: TimeRange }) => *,
  selectedTimeRange: TimeRange,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
}

const mapDispatchToProps = {
  saveSettings,
}

class AccountBalanceSummaryHeader extends PureComponent<Props> {
  handleChangeSelectedTime = item => {
    this.props.saveSettings({ selectedTimeRange: item.key })
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

    const unit = account.unit
    const cvUnit = counterValue.units[0]
    const data = [
      { oldBalance: first.value, balance: last.value, unit },
      { oldBalance: first.countervalue, balance: last.countervalue, unit: cvUnit },
    ]
    if (countervalueFirst) {
      data.reverse()
    }

    return (
      <Box flow={4} mb={2}>
        <Box horizontal>
          <BalanceTotal
            style={{ cursor: 'pointer' }}
            onClick={() => setCountervalueFirst(!countervalueFirst)}
            showCryptoEvenIfNotAvailable
            isAvailable={isAvailable}
            totalBalance={data[0].balance}
            unit={data[0].unit}
          >
            <FormattedVal
              key={account.id}
              animateTicker
              disableRounding
              alwaysShowSign={false}
              color="warmGrey"
              unit={data[1].unit}
              fontSize={6}
              showCode
              val={data[1].balance}
            />
          </BalanceTotal>
          <Box>
            <PillsDaysCount selected={selectedTimeRange} onChange={this.handleChangeSelectedTime} />
          </Box>
        </Box>
        <Box horizontal justifyContent="center" flow={7}>
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
