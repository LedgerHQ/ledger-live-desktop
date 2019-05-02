// @flow

import React, { PureComponent } from 'react'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { push } from 'react-router-redux'
import styled from 'styled-components'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import AccountsHeader from './AccountsHeader'
import AccountList from './AccountList'
import { accountsSelector } from '../../reducers/accounts'

type Props = {
  accounts: Account[],
  push: Function,
}

type State = {
  range: PortfolioRange,
}

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
})

const mapDispatchToProps = {
  push,
}

export const GenericBox = styled(Box)`
  background: #ffffff;
  flex: 1;
  padding: 10px 20px;
  margin-bottom: 9px;
  color: #abadb6;
  font-weight: 600;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 #00000007;
`

class AccountsPage extends PureComponent<Props, State> {
  state = {
    range: 'year',
  }

  onAccountClick = account => this.props.push(`/account/${account.id}`)
  onRangeChange = (range: PortfolioRange) => this.setState({ range })

  render() {
    const { accounts } = this.props
    const { range } = this.state
    return (
      <Box>
        <TrackPage category="Accounts" />
        <AccountsHeader />
        <AccountList
          onAccountClick={this.onAccountClick}
          onRangeChange={this.onRangeChange}
          accounts={accounts}
          range={range}
        />
      </Box>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountsPage)
