// @flow

import React, { Component } from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import type { Account } from '@ledgerhq/live-common/lib/types'
import CounterValues from 'helpers/countervalues'

import type { T } from 'types/common'

import {
  getOrderAccounts,
  intermediaryCurrency,
  currencySettingsForAccountSelector,
} from 'reducers/settings'
import { createStructuredSelector, createSelector } from 'reselect'
import { reorderAccounts } from 'actions/accounts'
import { accountsSelector } from 'reducers/accounts'
import { saveSettings } from 'actions/settings'

import BoldToggle from 'components/base/BoldToggle'
import Box from 'components/base/Box'
import DropDown, { DropDownItem } from 'components/base/DropDown'
import Text from 'components/base/Text'

import IconAngleDown from 'icons/AngleDown'
import IconArrowDown from 'icons/ArrowDown'
import IconArrowUp from 'icons/ArrowUp'

type Props = {
  t: T,
  orderAccounts: string,
  accounts: Account[],
  accountsBtcBalance: number[], // eslint-disable-line
  reorderAccounts: (string[]) => *,
  saveSettings: (*) => *,
}

type SortMethod = 'name' | 'balance'

const sortMethod: { [_: SortMethod]: (Account[], Props) => string[] } = {
  balance: (accounts, { accountsBtcBalance }: Props) =>
    accounts
      .map((a, i) => [a.id, accountsBtcBalance[i]])
      .sort((a, b) => a[1] - b[1])
      .map(o => o[0]),

  name: accounts =>
    accounts
      .slice(0)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(a => a.id),
}

function sortAccounts(accounts: Account[], orderAccounts: string, props: Props) {
  const [order, sort] = orderAccounts.split('|')
  if (order === 'name' || order === 'balance') {
    const ids = sortMethod[order](accounts, props)
    if (sort === 'asc') {
      ids.reverse()
    }
    return ids
  }
  console.warn(`sortAccounts not implemented for ${orderAccounts}`)
  return null
}

const OrderIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'wallet',
})`
  opacity: ${p => (p.isActive ? 1 : 0)};
`

const accountsBtcBalanceSelector = createSelector(
  accountsSelector,
  state => state,
  (accounts, state) =>
    accounts.map(account => {
      const { exchange } = currencySettingsForAccountSelector(state, { account })
      return (
        (exchange &&
          CounterValues.calculateSelector(state, {
            from: account.currency,
            to: intermediaryCurrency,
            exchange,
            value: account.balance,
          })) ||
        0
      )
    }),
)

const mapStateToProps = createStructuredSelector({
  orderAccounts: getOrderAccounts,
  accounts: accountsSelector,
  accountsBtcBalance: accountsBtcBalanceSelector,
})

const mapDispatchToProps = {
  reorderAccounts,
  saveSettings,
}

class AccountsOrder extends Component<Props> {
  onStateChange = ({ selectedItem: item }) => {
    if (!item) {
      return
    }
    const currentAccountOrder = this.getCurrentValue()
    const [accountOrder] = item.key.split('|')

    const order =
      currentAccountOrder === accountOrder ? this.getReverseOrder() : this.getCurrentOrder()

    this.setAccountOrder(`${accountOrder}|${order}`)
  }

  setAccountOrder = order => {
    const { saveSettings, reorderAccounts } = this.props
    const maybeIds = sortAccounts(this.props.accounts, order, this.props)
    if (maybeIds) {
      reorderAccounts(maybeIds)
      saveSettings({ orderAccounts: order })
    }
  }

  getCurrentOrder = () => {
    const { orderAccounts } = this.props
    if (orderAccounts !== null) {
      return orderAccounts.split('|')[1]
    }
    return 'desc'
  }

  getCurrentValue = () => {
    const { orderAccounts } = this.props
    if (orderAccounts !== null) {
      return orderAccounts.split('|')[0]
    }
    return null
  }

  getReverseOrder = () => {
    const currentOrder = this.getCurrentOrder()
    return currentOrder === 'desc' ? 'asc' : 'desc'
  }

  getSortItems = () => {
    const { t } = this.props
    const currentOrder = this.getCurrentOrder()
    return [
      {
        key: 'name',
        label: t('accountsOrder:name'),
      },
      {
        key: 'balance',
        label: t('accountsOrder:balance'),
      },
    ].map(item => ({
      ...item,
      key: `${item.key}|${currentOrder}`,
    }))
  }

  renderItem = ({ item, isHighlighted, isActive }) => {
    const [, order] = item.key.split('|')
    return (
      <DropDownItem
        alignItems="center"
        justifyContent="flex-start"
        horizontal
        isHighlighted={isHighlighted}
        isActive={isActive}
        flow={2}
      >
        <Box grow alignItems="flex-start">
          <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
        </Box>
        <OrderIcon isActive={isActive}>
          {order === 'desc' ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />}
        </OrderIcon>
      </DropDownItem>
    )
  }

  render() {
    const { t, orderAccounts } = this.props

    const sortItems = this.getSortItems()

    return (
      <DropDown
        flow={1}
        offsetTop={2}
        horizontal
        items={sortItems}
        renderItem={this.renderItem}
        onStateChange={this.onStateChange}
        value={sortItems.find(item => item.key === orderAccounts)}
      >
        <Text ff="Open Sans|SemiBold" fontSize={4}>
          {t('common:sortBy')}
        </Text>
        <Box
          alignItems="center"
          color="dark"
          ff="Open Sans|SemiBold"
          flow={1}
          fontSize={4}
          horizontal
        >
          <Text color="dark">{t(`accountsOrder:${this.getCurrentValue() || 'balance'}`)}</Text>
          <IconAngleDown size={16} />
        </Box>
      </DropDown>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(AccountsOrder)
