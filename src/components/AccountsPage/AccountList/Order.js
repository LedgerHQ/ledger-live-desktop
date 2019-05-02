// @flow

import React, { Component } from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import type { T } from 'types/common'
import { refreshAccountsOrdering } from 'actions/general'
import { saveSettings } from 'actions/settings'
import { getOrderAccounts } from 'reducers/settings'
import Track from 'analytics/Track'
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
  refreshAccountsOrdering: () => *,
  saveSettings: (*) => *,
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
})

const mapDispatchToProps = {
  refreshAccountsOrdering,
  saveSettings,
}

class Order extends Component<Props> {
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
    const { saveSettings, refreshAccountsOrdering } = this.props
    saveSettings({ orderAccounts: order })
    refreshAccountsOrdering()
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
        label: t('accounts.order.name'),
      },
      {
        key: 'balance',
        label: t('accounts.order.balance'),
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
          {order === 'asc' ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />}
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
        <Track onUpdate event="ChangeSort" orderAccounts={orderAccounts} />
        <Text ff="Open Sans|SemiBold" fontSize={4}>
          {t('common.sortBy')}
        </Text>
        <Box
          alignItems="center"
          color="wallet"
          ff="Open Sans|SemiBold"
          flow={1}
          fontSize={4}
          horizontal
        >
          <Text color="wallet">{t(`accounts.order.${this.getCurrentValue() || 'balance'}`)}</Text>
          <IconAngleDown size={16} />
        </Box>
      </DropDown>
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(Order)
