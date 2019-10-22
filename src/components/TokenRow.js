// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import type { Account, AccountLike } from '@ledgerhq/live-common/lib/types/account'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import { getAccountCurrency } from '@ledgerhq/live-common/lib/account'
import { openModal } from 'reducers/modals'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Header from './AccountsPage/AccountRowItem/Header'
import Balance from './AccountsPage/AccountRowItem/Balance'
import Delta from './AccountsPage/AccountRowItem/Delta'
import Countervalue from './AccountsPage/AccountRowItem/Countervalue'
import Star from './Stars/Star'

type Props = {
  account: AccountLike,
  nested?: boolean,
  disableRounding?: boolean,
  index: number,
  parentAccount: Account,
  onClick: (AccountLike, ?Account) => void,
  range: PortfolioRange,
}

const mapDispatchToProps = {
  openModal,
}

const TopLevelRow = styled(Box)`
  background: ${p => p.theme.colors.palette.background.paper};
  align-items: center;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 4px 8px 0 #00000007;
  flex-direction: row;
  color: #abadb6;
  cursor: pointer;
  display: flex;
  margin-bottom: 9px;
  padding: 20px;
  :hover {
    border-color: ${p => p.theme.colors.palette.text.shade40};
  }
`

const NestedRow = styled(Box)`
  flex: 1;
  font-weight: 600;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  position: relative;
  &:last-of-type {
    margin-bottom: 0px;
  }
`

class TokenRow extends PureComponent<Props> {
  onClick = () => {
    const { account, parentAccount, onClick } = this.props
    onClick(account, parentAccount)
  }

  render() {
    const { account, range, index, nested, disableRounding } = this.props
    const currency = getAccountCurrency(account)
    const unit = currency.units[0]
    const Row = nested ? NestedRow : TopLevelRow
    return (
      <Row index={index} onClick={this.onClick}>
        <Header nested={nested} account={account} />
        <Balance unit={unit} balance={account.balance} disableRounding={disableRounding} />
        <Countervalue account={account} currency={currency} range={range} />
        <Delta account={account} range={range} />
        <Star accountId={account.id} />
      </Row>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(TokenRow)
