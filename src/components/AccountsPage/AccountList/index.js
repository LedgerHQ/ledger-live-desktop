// @flow

import React, { Component } from 'react'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'

import Box from 'components/base/Box'
import AccountListHeader from './Header'
import GridBody from '../AccountList/GridBody'
import ListBody from '../AccountList/ListBody'

type Props = {
  accounts: Account[],
  onRangeChange: PortfolioRange => void,
  onAccountClick: Account => void,
  range: PortfolioRange,
}

type State = {
  mode: string,
  search: string,
}

class AccountList extends Component<Props, State> {
  state = {
    mode: 'card',
    search: '',
  }

  onModeChange = () =>
    this.setState(prevState => ({ mode: prevState.mode === 'card' ? 'list' : 'card' }))

  onTextChange = (evt: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({
      search: evt.target.value,
    })

  render() {
    const { accounts, range, onAccountClick, onRangeChange } = this.props
    const { mode, search } = this.state
    const isUsingCards = this.state.mode === 'card'
    const Body = isUsingCards ? GridBody : ListBody

    const filteredAccounts = accounts.filter(account =>
      `${account.currency.ticker}|${account.currency.name}|${account.name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )

    return (
      <Box flow={4}>
        <AccountListHeader
          onTextChange={this.onTextChange}
          onModeChange={this.onModeChange}
          onRangeChange={onRangeChange}
          mode={mode}
          range={range}
          search={search}
          accountsLength={accounts.length}
        />
        <Body
          horizontal
          data-e2e="dashboard_AccountList"
          range={range}
          accounts={filteredAccounts}
          onAccountClick={onAccountClick}
        />
      </Box>
    )
  }
}

export default AccountList
