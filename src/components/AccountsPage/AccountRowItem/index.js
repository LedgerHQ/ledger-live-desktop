// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Box from 'components/base/Box'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import { openModal } from 'reducers/modals'
import { connect } from 'react-redux'
import IconAngleDown from 'icons/AngleDown'
import Header from './Header'
import Balance from './Balance'
import Countervalue from './Countervalue'
import Delta from './Delta'
import AccountSyncStatusIndicator from '../AccountSyncStatusIndicator'
import ContextMenuItem from '../../ContextMenu/ContextMenuItem'
import IconSend from '../../../icons/Send'
import IconReceive from '../../../icons/Receive'
import IconAccountSettings from '../../../icons/AccountSettings'
import { MODAL_RECEIVE, MODAL_SEND, MODAL_SETTINGS_ACCOUNT } from '../../../config/constants'
import TokenRow from '../../TokenRow'

const Wrapper = styled.div`
  display: ${p => (p.hidden ? 'none' : 'contents')};
`

const Row = styled(Box)`
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 4px 8px 0 #00000007;
  color: #abadb6;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex: 1;
  font-weight: 600;
  justify-content: flex-start;
  margin-bottom: ${p => (p.tokens && !p.expanded ? 18 : 9)}px;
  padding: 16px 20px;
  position: relative;
  :hover {
    border-color: ${p => p.theme.colors.lightFog};
  }
`

const RowContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`

const TokenContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 20px;
`

const TokenAccountIndicator = styled.div`
  background: #ffffff;
  border-radius: 0px 0px 4px 4px;
  box-shadow: 0 4px 8px 0 #00000007;
  height: 7px;
  margin: -18px 10px 8px 10px;
`

export const TokenShowMoreIndicator = styled.button`
  background-color: ${p => p.color || p.theme.colors.pillActiveBackground};
  border-radius: ${p => p.size}px;
  border-width: 0px;
  color: ${p => p.color || p.theme.colors.wallet};
  height: ${p => p.size}px;
  line-height: ${p => p.size}px;
  text-align: center;
  transform: ${p => (p.expanded ? 'rotate(180deg)' : 'none')};
  width: ${p => p.size}px;
  transition: all 0.3s linear;
`

type Props = {
  account: TokenAccount | Account,
  parentAccount: ?Account,
  disableRounding?: boolean,
  onClick: (Account | TokenAccount, ?Account) => void,
  hidden?: boolean,
  range: PortfolioRange,
  openModal: Function,
}

type State = {
  expanded: boolean,
}

const mapDispatchToProps = {
  openModal,
}

class AccountRowItem extends PureComponent<Props, State> {
  state = {
    expanded: false,
  }

  onClick = () => {
    const { account, parentAccount, onClick } = this.props
    onClick(account, parentAccount)
  }

  contextMenuItems = [
    {
      label: 'accounts.contextMenu.send',
      Icon: IconSend,
      callback: () => this.props.openModal(MODAL_SEND, { account: this.props.account }),
    },
    {
      label: 'accounts.contextMenu.receive',
      Icon: IconReceive,
      callback: () => this.props.openModal(MODAL_RECEIVE, { account: this.props.account }),
    },
    {
      label: 'accounts.contextMenu.edit',
      Icon: IconAccountSettings,
      callback: () => this.props.openModal(MODAL_SETTINGS_ACCOUNT, { account: this.props.account }),
    },
  ]

  toggleAccordion = e => {
    e.stopPropagation()
    this.setState(prevState => ({ expanded: !prevState.expanded }))
  }

  render() {
    const { account, parentAccount, range, hidden, onClick, disableRounding } = this.props
    const { expanded } = this.state

    let currency
    let unit
    let mainAccount
    let tokens

    if (account.type !== 'Account') {
      currency = account.token
      unit = account.token.units[0]
      mainAccount = parentAccount

      if (!mainAccount) return null
    } else {
      currency = account.currency
      unit = account.unit
      mainAccount = account
      tokens = account.tokenAccounts
    }

    const showTokensIndicator = tokens && tokens.length > 0 && !hidden
    return (
      <Wrapper hidden={hidden}>
        <Row expanded={expanded} tokens={showTokensIndicator} key={mainAccount.id}>
          <ContextMenuItem items={this.contextMenuItems}>
            <RowContent onClick={this.onClick}>
              <Header account={account} name={mainAccount.name} />
              <Box flex="12%">
                <div>
                  <AccountSyncStatusIndicator accountId={mainAccount.id} />
                </div>
              </Box>
              <Balance unit={unit} balance={account.balance} disableRounding={disableRounding} />
              <Countervalue account={account} currency={currency} range={range} />
              <Delta account={account} range={range} />
              {showTokensIndicator ? (
                <TokenShowMoreIndicator
                  size={18}
                  expanded={expanded}
                  onClick={this.toggleAccordion}
                >
                  <IconAngleDown size={16} />
                </TokenShowMoreIndicator>
              ) : (
                <div style={{ width: 18 }} />
              )}
            </RowContent>
          </ContextMenuItem>
          {showTokensIndicator &&
            expanded && (
              <TokenContent>
                {tokens &&
                  tokens.map((token, index) => (
                    <TokenRow
                      nested
                      index={index}
                      key={token.id}
                      range={range}
                      account={token}
                      parentAccount={mainAccount}
                      onClick={onClick}
                    />
                  ))}
              </TokenContent>
            )}
        </Row>
        {showTokensIndicator && !expanded && <TokenAccountIndicator />}
      </Wrapper>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(AccountRowItem)
