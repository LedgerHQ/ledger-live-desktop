// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import { openModal } from 'reducers/modals'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Header from './Header'
import Balance from './Balance'
import Delta from './Delta'
import Countervalue from './Countervalue'

type Props = {
  account: TokenAccount,
  index: number,
  parentAccount: Account,
  onClick: (Account | TokenAccount, ?Account) => void,
  range: PortfolioRange,
}

const mapDispatchToProps = {
  openModal,
}

const Row = styled(Box)`
  flex: 1;
  height: 40px;
  font-weight: 600;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  position: relative;

  opacity: 0;
  animation: fadeIn 0.3s ease both;
  animation-delay: ${p => p.index * 0.3}s;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
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
    } = this.props
    const unit = account.token.units[0]

    return (
      <Row index={index} onClick={this.onClick}>
        <Header account={account} name={token.name} />
        <Box flex="12%" />
        <Balance unit={unit} balance={account.balance} />
        <Countervalue account={account} currency={token} range={range} />
        <Delta account={account} range={range} />
        <div style={{ width: 18 }} />
      </Row>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(TokenRow)
