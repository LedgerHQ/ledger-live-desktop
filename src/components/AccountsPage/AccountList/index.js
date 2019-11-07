// @flow

import React, { Component } from 'react'
import type {
  TokenAccount,
  Account,
  AccountLike,
  PortfolioRange,
} from '@ledgerhq/live-common/lib/types'
import {
  listSubAccounts,
  getAccountCurrency,
  getAccountName,
} from '@ledgerhq/live-common/lib/account/helpers'
import { Trans } from 'react-i18next'

import Text from 'components/base/Text'
import StickyBackToTop from 'components/StickyBackToTop'
import AccountListHeader from './Header'
import GridBody from '../AccountList/GridBody'
import ListBody from '../AccountList/ListBody'

type Props = {
  accounts: (Account | TokenAccount)[],
  mode: *,
  onModeChange: (*) => void,
  onRangeChange: PortfolioRange => void,
  onAccountClick: (Account | TokenAccount, ?Account) => void,
  range: PortfolioRange,
}

type State = {
  search: string,
}

const BodyByMode = {
  card: GridBody,
  list: ListBody,
}

export const matchesSearch = (
  search?: string,
  account: AccountLike,
  subMatch: boolean = false,
): boolean => {
  if (!search) return true
  let match

  if (account.type === 'Account') {
    match = `${account.currency.ticker}|${account.currency.name}|${getAccountName(account)}`
    subMatch =
      subMatch &&
      !!account.subAccounts &&
      listSubAccounts(account).some(token => matchesSearch(search, token))
  } else {
    const c = getAccountCurrency(account)
    match = `${c.ticker}|${c.name}|${getAccountName(account)}`
  }

  return match.toLowerCase().includes(search.toLowerCase()) || subMatch
}

class AccountList extends Component<Props, State> {
  state = {
    search: '',
  }

  lookupParentAccount = (id: string): ?Account => {
    for (const a of this.props.accounts) {
      if (a.type === 'Account' && a.id === id) {
        return a
      }
    }
    return null
  }

  onTextChange = (evt: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({
      search: evt.target.value,
    })

  render() {
    const { accounts, range, onAccountClick, onModeChange, onRangeChange, mode } = this.props
    const { search } = this.state
    const Body = BodyByMode[mode]

    const visibleAccounts = []
    const hiddenAccounts = []
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i]
      if (matchesSearch(search, account, mode === 'list')) {
        visibleAccounts.push(account)
      } else {
        hiddenAccounts.push(account)
      }
    }

    return (
      <div style={{ paddingBottom: 70 }}>
        <AccountListHeader
          onTextChange={this.onTextChange}
          onModeChange={onModeChange}
          onRangeChange={onRangeChange}
          mode={mode}
          range={range}
          search={search}
          accountsLength={accounts.length}
        />
        {visibleAccounts.length === 0 ? (
          <Text style={{ display: 'block', padding: 60, textAlign: 'center' }}>
            <Trans i18nKey="accounts.noResultFound" />
          </Text>
        ) : null}
        <Body
          horizontal
          data-e2e="dashboard_AccountList"
          range={range}
          search={search}
          visibleAccounts={visibleAccounts}
          hiddenAccounts={hiddenAccounts}
          showNewAccount={!search}
          onAccountClick={onAccountClick}
          lookupParentAccount={this.lookupParentAccount}
        />
        <StickyBackToTop scrollUpOnMount />
      </div>
    )
  }
}

export default AccountList
