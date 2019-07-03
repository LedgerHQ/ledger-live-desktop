// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import { openModal } from 'reducers/modals'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Header from './AccountsPage/AccountRowItem/Header'
import Balance from './AccountsPage/AccountRowItem/Balance'
import Delta from './AccountsPage/AccountRowItem/Delta'
import Countervalue from './AccountsPage/AccountRowItem/Countervalue'

type Props = {
  account: TokenAccount,
  nested?: boolean,
  disableRounding?: boolean,
  index: number,
  parentAccount: Account,
  onClick: (Account | TokenAccount, ?Account) => void,
  range: PortfolioRange,
}

const mapDispatchToProps = {
  openModal,
}

const TopLevelRow = styled(Box)`
  background: #ffffff;
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
    border-color: ${p => p.theme.colors.lightFog};
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
    const {
      account,
      account: { token },
      range,
      index,
      nested,
      disableRounding,
    } = this.props
    const unit = account.token.units[0]
    const Row = nested ? NestedRow : TopLevelRow
    return (
      <Row index={index} onClick={this.onClick}>
        <Header nested={nested} account={account} name={token.name} />
        <Balance unit={unit} balance={account.balance} disableRounding={disableRounding} />
        <Countervalue account={account} currency={token} range={range} />
        <Delta account={account} range={range} />
      </Row>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(TokenRow)
