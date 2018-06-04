// @flow

import React, { Component } from 'react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import type { Account } from '@ledgerhq/live-common/lib/types'

import type { T } from 'types/common'

import { getOrderAccounts } from 'reducers/settings'
import { createStructuredSelector } from 'reselect'
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

function sortAccounts(accounts: Account[], orderAccounts: string) {
  const [order, sort] = orderAccounts.split('|')

  const accountsSorted = sortBy(accounts, a => {
    if (order === 'balance') {
      return a.balance
    }

    return a[order]
  })

  if (sort === 'asc') {
    accountsSorted.reverse()
  }

  return accountsSorted
}

const OrderIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'wallet',
})`
  opacity: ${p => (p.isActive ? 1 : 0)};
`

const mapStateToProps = createStructuredSelector({
  orderAccounts: getOrderAccounts,
  accounts: accountsSelector,
})

const mapDispatchToProps = {
  reorderAccounts,
  saveSettings,
}

type Props = {
  t: T,
  orderAccounts: string,
  accounts: Account[],
  reorderAccounts: (string[]) => *,
  saveSettings: (*) => *,
}

type State = {
  cachedValue: string | null,
}

class AccountsOrder extends Component<Props, State> {
  state = {
    cachedValue: null,
  }

  componentWillMount() {
    this.setState({ cachedValue: this.props.orderAccounts })
  }

  setAccountOrder = debounce(
    order => {
      const { saveSettings } = this.props
      this.setState({ cachedValue: order }, () => {
        window.requestIdleCallback(() => {
          this.props.reorderAccounts(sortAccounts(this.props.accounts, order).map(a => a.id))
          saveSettings({ orderAccounts: order })
        })
      })
    },
    250,
    {
      leading: true,
    },
  )

  getCurrentOrder = () => {
    const { cachedValue } = this.state

    if (cachedValue !== null) {
      return cachedValue.split('|')[1]
    }

    return 'desc'
  }

  getCurrentValue = () => {
    const { cachedValue } = this.state

    if (cachedValue !== null) {
      return cachedValue.split('|')[0]
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
      {
        key: 'type',
        label: t('accountsOrder:type'),
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
    const { t } = this.props
    const { cachedValue } = this.state

    const sortItems = this.getSortItems()

    return (
      <DropDown
        flow={1}
        offsetTop={2}
        horizontal
        items={sortItems}
        renderItem={this.renderItem}
        keepOpenOnChange
        onStateChange={({ selectedItem: item }) => {
          if (!item) {
            return
          }

          const currentAccountOrder = this.getCurrentValue()
          const [accountOrder] = item.key.split('|')

          const order =
            currentAccountOrder === accountOrder ? this.getReverseOrder() : this.getCurrentOrder()

          this.setAccountOrder(`${accountOrder}|${order}`)
        }}
        value={sortItems.find(item => item.key === cachedValue)}
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
