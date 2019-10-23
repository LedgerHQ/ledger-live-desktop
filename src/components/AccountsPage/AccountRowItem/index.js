// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Box from 'components/base/Box'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import { listSubAccounts } from '@ledgerhq/live-common/lib/account/helpers'
import { listTokenTypesForCryptoCurrency } from '@ledgerhq/live-common/lib/currencies'
import { Trans } from 'react-i18next'
import Text from 'components/base/Text'
import IconAngleDown from 'icons/AngleDown'
import Header from './Header'
import Balance from './Balance'
import Countervalue from './Countervalue'
import Delta from './Delta'
import AccountSyncStatusIndicator from '../AccountSyncStatusIndicator'
import TokenRow from '../../TokenRow'
import { matchesSearch } from '../AccountList'
import Star from '../../Stars/Star'
import AccountContextMenu from '../../ContextMenu/AccountContextMenu'

const Row = styled(Box)`
  background: ${p => p.theme.colors.palette.background.paper};
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
  margin-bottom: 9px;
  padding: 16px 20px;
  position: relative;
  :hover {
    border-color: ${p => p.theme.colors.palette.text.shade40};
  }
`

const RowContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  opacity: ${p => (p.disabled ? 0.3 : 1)};
  & * {
    color: ${p => (p.disabled ? p.theme.colors.palette.text.shade100 : 'auto')};
    fill: ${p => (p.disabled ? p.theme.colors.palette.text.shade100 : 'auto')};
  }
`

const TokenContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 20px;
`

const TokenContentWrapper = styled.div`
  position: relative;
`

const TokenBarIndicator = styled.div`
  width: 15px;
  border-left: 1px solid ${p => p.theme.colors.palette.divider};
  z-index: 2;
  margin-left: 9px;
  padding-left: 5px;
  position: absolute;
  left: 0;
  height: 100%;
  &:hover {
    border-color: ${p => p.theme.colors.palette.text.shade60};
  }
`

const TokenShowMoreIndicator = styled.div`
  margin: 15px -20px -16px;
  display: flex;
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  background: ${p => p.theme.colors.palette.background.paper};
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
  search?: string,
}

type State = {
  expanded: boolean,
}

const expandedStates: { [key: string]: boolean } = {}

class AccountRowItem extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    const { account, parentAccount } = this.props
    const accountId = parentAccount ? parentAccount.id : account.id

    this.state = {
      expanded: expandedStates[accountId],
    }
  }

  static getDerivedStateFromProps(nextProps: Props) {
    const { account } = nextProps
    if (account.subAccounts) {
      return {
        expanded: expandedStates[account.id] || !!nextProps.search,
      }
    }
    return null
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.expanded !== this.state.expanded && !this.state.expanded) {
      const { scrollTopFocusRef } = this
      if (scrollTopFocusRef.current) {
        scrollTopFocusRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }

  scrollTopFocusRef: * = React.createRef()

  onClick = () => {
    const { account, parentAccount, onClick } = this.props
    onClick(account, parentAccount)
  }

  toggleAccordion = (e: SyntheticEvent<*>) => {
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
    let isToken

    if (account.type !== 'Account') {
      currency = account.token
      unit = account.token.units[0]
      mainAccount = parentAccount
      isToken = mainAccount && listTokenTypesForCryptoCurrency(mainAccount.currency).length > 0

      if (!mainAccount) return null
    } else {
      currency = account.currency
      unit = account.unit
      mainAccount = account
      tokens = listSubAccounts(account)
      disabled = !matchesSearch(search, account)
      isToken = listTokenTypesForCryptoCurrency(currency).length > 0
      if (tokens) tokens = tokens.filter(t => matchesSearch(search, t))
    }

    const showTokensIndicator = tokens && tokens.length > 0 && !hidden

    const translationMap = isToken
      ? {
          see: 'tokensList.seeTokens',
          hide: 'tokensList.hideTokens',
        }
      : {
          see: 'subAccounts.seeSubAccounts',
          hide: 'subAccounts.hideSubAccounts',
        }

    return (
      <div style={{ position: 'relative' }} hidden={hidden}>
        <span style={{ position: 'absolute', top: -70 }} ref={this.scrollTopFocusRef} />
        <Row expanded={expanded} tokens={showTokensIndicator} key={mainAccount.id}>
          <AccountContextMenu account={account}>
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
              <Star accountId={account.id} />
            </RowContent>
          </AccountContextMenu>
          {showTokensIndicator && expanded && (
            <TokenContentWrapper>
              <TokenBarIndicator onClick={this.toggleAccordion} />
              <TokenContent>
                {tokens &&
                  tokens.map((token, index) => (
                    <AccountContextMenu key={token.id} account={token} parentAccount={mainAccount}>
                      <TokenRow
                        nested
                        index={index}
                        range={range}
                        account={token}
                        parentAccount={mainAccount}
                        onClick={onClick}
                      />
                    </AccountContextMenu>
                  ))}
              </TokenContent>
            </TokenContentWrapper>
          )}
          {showTokensIndicator && !disabled && tokens && (
            <TokenShowMoreIndicator expanded={expanded} onClick={this.toggleAccordion}>
              <Text color="wallet" ff="Inter|SemiBold" fontSize={4}>
                <Trans
                  i18nKey={translationMap[expanded ? 'hide' : 'see']}
                  values={{ tokenCount: tokens.length }}
                />
              </Text>
              <IconAngleDown size={16} />
            </TokenShowMoreIndicator>
          )}
        </Row>
      </div>
    )
  }
}

export default AccountRowItem
