// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router'
import type { Currency, Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { accountSelector } from 'reducers/accounts'
import isAccountEmpty from 'helpers/isAccountEmpty'
import {
  counterValueCurrencySelector,
  localeSelector,
  selectedTimeRangeSelector,
  timeRangeDaysByKey,
} from 'reducers/settings'
import type { TimeRange } from 'reducers/settings'

import TrackPage from 'analytics/TrackPage'
import SyncOneAccountOnMount from 'components/SyncOneAccountOnMount'
import BalanceSummary from 'components/BalanceSummary'
import Box from 'components/base/Box'
import OperationsList from 'components/OperationsList'
import StickyBackToTop from 'components/StickyBackToTop'

import AccountHeader from './AccountHeader'
import AccountHeaderActions from './AccountHeaderActions'
import AccountBalanceSummaryHeader from './AccountBalanceSummaryHeader'
import EmptyStateAccount from './EmptyStateAccount'

const mapStateToProps = (state, props) => ({
  account: accountSelector(state, { accountId: props.match.params.id }),
  counterValue: counterValueCurrencySelector(state),
  settings: localeSelector(state),
  selectedTimeRange: selectedTimeRangeSelector(state),
})

const mapDispatchToProps = null

type Props = {
  counterValue: Currency,
  t: T,
  account?: Account,
  selectedTimeRange: TimeRange,
}

class AccountPage extends PureComponent<Props> {
  renderBalanceSummaryHeader = ({ isAvailable, totalBalance, sinceBalance, refBalance }) => {
    const { account } = this.props
    if (!account) return null
    return (
      <AccountBalanceSummaryHeader
        accountId={account.id}
        isAvailable={isAvailable}
        totalBalance={totalBalance}
        sinceBalance={sinceBalance}
        refBalance={refBalance}
      />
    )
  }

  render() {
    const { account, t, counterValue, selectedTimeRange } = this.props
    const daysCount = timeRangeDaysByKey[selectedTimeRange]

    if (!account) {
      return <Redirect to="/" />
    }

    return (
      <Box>
        <TrackPage
          category="Account"
          currency={account.currency.id}
          operationsLength={account.operations.length}
        />

        <SyncOneAccountOnMount priority={10} accountId={account.id} />

        <Box horizontal mb={5} flow={4}>
          <AccountHeader account={account} />
          <AccountHeaderActions account={account} />
        </Box>

        {!isAccountEmpty(account) ? (
          <Fragment>
            <Box mb={7}>
              <BalanceSummary
                accounts={[account]}
                chartColor={account.currency.color}
                chartId={`account-chart-${account.id}`}
                counterValue={counterValue}
                daysCount={daysCount}
                selectedTimeRange={selectedTimeRange}
                renderHeader={this.renderBalanceSummaryHeader}
              />
            </Box>

            <OperationsList account={account} title={t('app:account.lastOperations')} />

            <StickyBackToTop />
          </Fragment>
        ) : (
          <EmptyStateAccount account={account} />
        )}
      </Box>
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(AccountPage)
