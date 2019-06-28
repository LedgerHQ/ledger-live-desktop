// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Trans, translate } from 'react-i18next'
import IconAngleDown from 'icons/AngleDown'
import IconCheck from 'icons/Check'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { connect } from 'react-redux'
import type { TokenAccount, Account } from '@ledgerhq/live-common/lib/types'
import { push } from 'react-router-redux'

import Text from 'components/base/Text'
import { accountsSelector } from '../../../reducers/accounts'
import CryptoCurrencyIcon from '../../CryptoCurrencyIcon'
import DropDown from '../../base/DropDown'
import Button, { Base } from '../../base/Button'
import { Separator } from './index'

type Props = {
  match: {
    params: {
      id: string,
      parentId?: string,
    },
    isExact: boolean,
    path: string,
    url: string,
  },
  accounts: Account[],
  push: string => void,
}

const Item = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 12px;
  min-width: 200px;
  color: ${p => (p.isActive ? p.theme.colors.dark : p.theme.colors.smoke)};
  > :first-child {
    margin-right: 10px;
  }

  > ${Text} {
    flex: 1;
  }

  &:hover {
    background: ${p => p.theme.colors.lightGrey};
    border-radius: 4px;
  }
`

const TextLink = styled.div`
  font-family: 'Open Sans';
  font-size: 12px;
  align-items: center;
  display: flex;
  flex-direction: row;
  -webkit-app-region: no-drag;
  > :first-child {
    margin-right: 8px;
  }
  ${p => (p.shrink ? 'flex: 1;' : '')}

  > ${Base} {
    text-overflow: ellipsis;
    flex-shrink: 1;
    overflow: hidden;
    padding: 0px;
    &:hover,
    &:active {
      background: transparent;
      text-decoration: underline;
    }
    margin-right: 7px;
  }
`
const AngleDown = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 20px;
  text-align: center;
  line-height: 16px;

  &:hover {
    background: ${p => p.theme.colors.fog};
  }
`

const Check = styled.div`
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  display: flex;
  text-align: right;
  margin-left: 20px;
`

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
})

const mapDispatchToProps = {
  push,
}

class AccountCrumb extends PureComponent<Props> {
  renderItem = ({ item, isActive }) => {
    const { parentId } = this.props.match.params

    return (
      <Item key={item.account.id} isActive={isActive}>
        <CryptoCurrencyIcon
          size={16}
          currency={parentId ? item.account.token : item.account.currency}
        />
        <Text ff={`Open Sans|${isActive ? 'SemiBold' : 'Regular'}`} fontSize={4}>
          {parentId ? item.account.token.name : item.account.name}
        </Text>
        {isActive && (
          <Check>
            <IconCheck size={14} />
          </Check>
        )}
      </Item>
    )
  }

  onAccountSelected = ({ selectedItem: item }) => {
    if (!item) {
      return
    }

    const { push, match } = this.props
    const { parentId } = match.params
    const {
      account: { id },
    } = item

    if (parentId) {
      push(`/account/${parentId}/${id}`)
    } else {
      push(`/account/${id}`)
    }
  }

  openActiveAccount = e => {
    e.preventDefault()
    const { push, match } = this.props
    const { parentId, id } = match.params
    if (parentId) {
      push(`/account/${parentId}/${id}`)
    } else {
      push(`/account/${id}`)
    }
  }

  processItemsForDropdown = (items: any[]) =>
    items.map(item => ({ key: item.id, label: item.id, account: item }))

  render() {
    const { parentId, id } = this.props.match.params
    const { accounts, push } = this.props

    if (!id) {
      return (
        <TextLink>
          <Button onClick={() => push('/accounts/')}>
            <Trans>{'accounts.title'}</Trans>
          </Button>
        </TextLink>
      )
    }

    let account: ?Account
    let tokenAccount: ?TokenAccount
    let currency
    let name
    let items

    if (parentId) {
      const parentAccount: ?Account = accounts.find(a => a.id === parentId)

      if (parentAccount && parentAccount.tokenAccounts) {
        items = parentAccount.tokenAccounts
        tokenAccount = items.find(t => t.id === id)

        if (tokenAccount) {
          currency = tokenAccount.token
          name = tokenAccount.token.name
        }
      }
      items = parentAccount && parentAccount.tokenAccounts
    } else {
      account = accounts.find(a => a.id === id)
      items = accounts

      if (account) {
        currency = account.currency
        name = account.name
      }
    }

    const processedItems = this.processItemsForDropdown(items || [])

    return (
      <>
        <Separator />
        <DropDown
          flex={1}
          shrink={parentId ? '0' : '1'}
          offsetTop={0}
          border
          horizontal
          items={processedItems}
          renderItem={this.renderItem}
          onStateChange={this.onAccountSelected}
          value={processedItems.find(a => a.key === id)}
        >
          <TextLink {...{ shrink: !parentId }}>
            {currency && <CryptoCurrencyIcon size={14} currency={currency} />}
            <Button onClick={this.openActiveAccount}>{name}</Button>
            <AngleDown>
              <IconAngleDown size={16} />
            </AngleDown>
          </TextLink>
        </DropDown>
      </>
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(AccountCrumb)
