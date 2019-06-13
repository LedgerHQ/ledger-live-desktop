// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router'
import type { Currency, TokenAccount, Account } from '@ledgerhq/live-common/lib/types'
import { getCurrencyColor } from '@ledgerhq/live-common/lib/currencies'
import type { T } from 'types/common'
import { accountSelector } from 'reducers/accounts'
import {
  isAccountEmpty,
  getAccountCurrency,
  getMainAccount,
} from '@ledgerhq/live-common/lib/account'
import { setCountervalueFirst } from 'actions/settings'
import {
  counterValueCurrencySelector,
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
import TokenList from './TokensList'

const mapStateToProps = (
  state,
  {
    match: {
      params: { id, parentId },
    },
  },
) => {
  const parentAccount: ?Account = parentId && accountSelector(state, { accountId: parentId })
  let account: ?(TokenAccount | Account)
  if (parentAccount) {
    const { tokenAccounts } = parentAccount
    if (tokenAccounts) {
      account = tokenAccounts.find(t => t.id === id)
    }
  } else {
    account = accountSelector(state, { accountId: id })
  }
  return {
    parentAccount,
    account,
    counterValue: counterValueCurrencySelector(state),
    selectedTimeRange: selectedTimeRangeSelector(state),
    countervalueFirst: countervalueFirstSelector(state),
  }
}

const mapDispatchToProps = {
  setCountervalueFirst,
}

type Props = {
  counterValue: Currency,
  t: T,
  account?: TokenAccount | Account,
  parentAccount?: Account,
  selectedTimeRange: TimeRange,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
}

class AccountPage extends PureComponent<Props> {
  render() {
    const {
      account,
      parentAccount,
      t,
      counterValue,
      selectedTimeRange,
      countervalueFirst,
      setCountervalueFirst,
    } = this.props

    const mainAccount = account ? getMainAccount(account, parentAccount) : null
    if (!account || !mainAccount) {
      return <Redirect to="/accounts" />
    }

    const currency = getAccountCurrency(account)
    const color = getCurrencyColor(currency)

    return (
      <Box key={account.id}>
        <TrackPage
          category="Account"
          currency={currency.id}
          operationsLength={account.operations.length}
        />
        <SyncOneAccountOnMount priority={10} accountId={mainAccount.id} />

        <Box horizontal mb={5} flow={4}>
          <AccountHeader account={account} />
          <AccountHeaderActions account={account} parentAccount={parentAccount} />
        </Box>

        {!isAccountEmpty(account) ? (
          <>
            <Box mb={7}>
              <BalanceSummary
                account={account}
                parentAccount={parentAccount}
                chartColor={color}
                chartId={`account-chart-${account.id}`}
                counterValue={counterValue}
                range={selectedTimeRange}
                countervalueFirst={countervalueFirst}
                setCountervalueFirst={setCountervalueFirst}
              />
            </Box>
            <TokenList account={account} range={selectedTimeRange} />
            <OperationsList
              account={account}
              parentAccount={parentAccount}
              title={t('account.lastOperations')}
            />
            <StickyBackToTop scrollUpOnMount />
          </>
        ) : (
          <EmptyStateAccount account={account} parentAccount={parentAccount} />
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
