// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Box from 'components/base/Box'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import { openModal } from 'reducers/modals'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import Text from 'components/base/Text'
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
import { matchesSearch } from '../AccountList'

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
  opacity: ${p => (p.disabled ? 0.3 : 1)};
  & * {
    color: ${p => (p.disabled ? p.theme.colors.dark : 'auto')};
    fill: ${p => (p.disabled ? p.theme.colors.dark : 'auto')};
  }
`

const TokenContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 20px;
`

const TokenShowMoreIndicator = styled.div`
  margin: 15px -20px -16px;
  display: flex;
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${p => p.theme.colors.lightFog};
  background: white;
  border-radius: 0px 0px 4px 4px;
  height: 32px;
  text-align: center;

  &:hover ${Text} {
    text-decoration: underline;
  }

  > :nth-child(2) {
    margin-left: 8px;
    transform: rotate(${p => (p.expanded ? '180deg' : '0deg')});
  }
`

type Props = {
  account: TokenAccount | Account,
  parentAccount: ?Account,
  disableRounding?: boolean,
  onClick: (Account | TokenAccount, ?Account) => void,
  hidden?: boolean,
  range: PortfolioRange,
  openModal: Function,
  search?: string,
}

type State = {
  expanded: boolean,
}

const mapDispatchToProps = {
  openModal,
}

const expandedStates: { [key: string]: boolean } = {}

class AccountRowItem extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    const { account, parentAccount } = this.props
    const accountId = parentAccount ? parentAccount.id : account.id

    this.state = {
      expanded: expandedStates[accountId],
    }
  }

  static getDerivedStateFromProps(nextProps: Props) {
    const { account } = nextProps
    if (account.tokenAccounts) {
      return {
        expanded: expandedStates[account.id] || !!nextProps.search,
      }
    }
    return null
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
    const { account } = this.props
    expandedStates[account.id] = !expandedStates[account.id]
    this.setState({ expanded: expandedStates[account.id] })
  }

  render() {
    const { account, parentAccount, range, hidden, onClick, disableRounding, search } = this.props
    const { expanded } = this.state

    let currency
    let unit
    let mainAccount
    let tokens
    let disabled

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
      disabled = !matchesSearch(search, account)
      if (tokens) tokens = tokens.filter(t => matchesSearch(search, t))
    }

    const showTokensIndicator = tokens && tokens.length > 0 && !hidden
    return (
      <Wrapper hidden={hidden}>
        <Row expanded={expanded} tokens={showTokensIndicator} key={mainAccount.id}>
          <ContextMenuItem items={this.contextMenuItems}>
            <RowContent disabled={disabled} onClick={this.onClick}>
              <Header account={account} name={mainAccount.name} />
              <Box flex="12%">
                <div>
                  <AccountSyncStatusIndicator accountId={mainAccount.id} />
                </div>
              </Box>
              <Balance unit={unit} balance={account.balance} disableRounding={disableRounding} />
              <Countervalue account={account} currency={currency} range={range} />
              <Delta account={account} range={range} />
            </RowContent>
          </ContextMenuItem>
          {showTokensIndicator && expanded && (
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
          {showTokensIndicator && !disabled && tokens && (
            <TokenShowMoreIndicator expanded={expanded} onClick={this.toggleAccordion}>
              <Text color="wallet" ff="Open Sans|SemiBold" fontSize={4}>
                <Trans
                  i18nKey={expanded ? 'tokensList.hideTokens' : 'tokensList.seeTokens'}
                  values={{ tokenCount: tokens.length }}
                />
              </Text>
              <IconAngleDown size={16} />
            </TokenShowMoreIndicator>
          )}
        </Row>
      </Wrapper>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(AccountRowItem)
