// @flow

import React, { PureComponent } from 'react'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import type { Currency, Account } from '@ledgerhq/live-common/lib/types'

import type { T } from 'types/common'

import { saveSettings } from 'actions/settings'
import { accountSelector } from 'reducers/accounts'
import { counterValueCurrencySelector, selectedTimeRangeSelector } from 'reducers/settings'
import type { TimeRange } from 'reducers/settings'

import {
  BalanceTotal,
  BalanceSinceDiff,
  BalanceSincePercent,
} from 'components/BalanceSummary/BalanceInfos'
import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import PillsDaysCount from 'components/PillsDaysCount'

type OwnProps = {
  isAvailable: boolean,
  totalBalance: number,
  sinceBalance: number,
  refBalance: number,
  accountId: string,
}

type Props = OwnProps & {
  counterValue: Currency,
  t: T,
  account: Account,
  saveSettings: ({ selectedTimeRange: TimeRange }) => *,
  selectedTimeRange: TimeRange,
}

const mapStateToProps = createStructuredSelector({
  account: accountSelector,
  counterValue: counterValueCurrencySelector,
  selectedTimeRange: selectedTimeRangeSelector,
})

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
      accountId,
      t,
      counterValue,
      selectedTimeRange,
      isAvailable,
      totalBalance,
      sinceBalance,
      refBalance,
    } = this.props

    return (
      <Box flow={4} mb={2}>
        <Box horizontal>
          <BalanceTotal
            showCryptoEvenIfNotAvailable
            isAvailable={isAvailable}
            totalBalance={account.balance}
            unit={account.unit}
          >
            <FormattedVal
              key={accountId}
              animateTicker
              disableRounding
              alwaysShowSign={false}
              color="warmGrey"
              unit={counterValue.units[0]}
              fontSize={6}
              showCode
              val={totalBalance}
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
            totalBalance={totalBalance}
            sinceBalance={sinceBalance}
            refBalance={refBalance}
            since={selectedTimeRange}
          />
          <BalanceSinceDiff
            isAvailable={isAvailable}
            t={t}
            counterValue={counterValue}
            alignItems="center"
            totalBalance={totalBalance}
            sinceBalance={sinceBalance}
            refBalance={refBalance}
            since={selectedTimeRange}
          />
        </Box>
      </Box>
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(), // FIXME t() is not even needed directly here. should be underlying component responsability to inject it
)(AccountBalanceSummaryHeader)
