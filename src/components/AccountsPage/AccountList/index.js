// @flow

import React, { Component } from 'react'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import { Trans, translate } from 'react-i18next'

import Text from 'components/base/Text'
import StickyBackToTop from 'components/StickyBackToTop'
import AccountListHeader from './Header'
import GridBody from '../AccountList/GridBody'
import ListBody from '../AccountList/ListBody'

type Props = {
  accounts: Account[],
  mode: *,
  onModeChange: (*) => void,
  onRangeChange: PortfolioRange => void,
  onAccountClick: Account => void,
  range: PortfolioRange,
}

type State = {
  search: string,
}

const BodyByMode = {
  card: GridBody,
  list: ListBody,
}

class AccountList extends Component<Props, State> {
  state = {
    search: '',
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
      if (
        !search ||
        `${account.currency.ticker}|${account.currency.name}|${account.name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
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
          visibleAccounts={visibleAccounts}
          hiddenAccounts={hiddenAccounts}
          showNewAccount={!search}
          onAccountClick={onAccountClick}
        />
        <StickyBackToTop />
      </div>
    )
  }
}

export default AccountList
