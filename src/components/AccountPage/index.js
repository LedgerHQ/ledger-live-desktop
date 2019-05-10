// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router'
import type { Currency, Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { accountSelector } from 'reducers/accounts'
import { isAccountEmpty } from '@ledgerhq/live-common/lib/account'
import { setCountervalueFirst } from 'actions/settings'
import {
  counterValueCurrencySelector,
  localeSelector,
  selectedTimeRangeSelector,
  countervalueFirstSelector,
} from 'reducers/settings'
import type { TimeRange } from 'reducers/settings'

import TrackPage from 'analytics/TrackPage'
import SyncOneAccountOnMount from 'components/SyncOneAccountOnMount'
import Box from 'components/base/Box'
import OperationsList from 'components/OperationsList'
import StickyBackToTop from 'components/StickyBackToTop'

import BalanceSummary from './BalanceSummary'
import AccountHeader from './AccountHeader'
import AccountHeaderActions from './AccountHeaderActions'
import EmptyStateAccount from './EmptyStateAccount'

const mapStateToProps = (state, props) => ({
  account: accountSelector(state, { accountId: props.match.params.id }),
  counterValue: counterValueCurrencySelector(state),
  settings: localeSelector(state),
  selectedTimeRange: selectedTimeRangeSelector(state),
  countervalueFirst: countervalueFirstSelector(state),
})

const mapDispatchToProps = {
  setCountervalueFirst,
}

type Props = {
  counterValue: Currency,
  t: T,
  account?: Account,
  selectedTimeRange: TimeRange,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
}

class AccountPage extends PureComponent<Props> {
  render() {
    const {
      account,
      t,
      counterValue,
      selectedTimeRange,
      countervalueFirst,
      setCountervalueFirst,
    } = this.props

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
                account={account}
                chartColor={account.currency.color}
                chartId={`account-chart-${account.id}`}
                counterValue={counterValue}
                range={selectedTimeRange}
                countervalueFirst={countervalueFirst}
                setCountervalueFirst={setCountervalueFirst}
              />
            </Box>
            <OperationsList account={account} title={t('account.lastOperations')} />
            <StickyBackToTop scrollUpOnMount />
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
