// @flow

import React, { Component } from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'

import type { MapStateToProps } from 'react-redux'
import type { T } from 'types/common'

import { getOrderAccounts } from 'reducers/settings'

import { updateOrderAccounts } from 'actions/accounts'
import { saveSettings } from 'actions/settings'

import BoldToggle from 'components/base/BoldToggle'
import Box from 'components/base/Box'
import DropDown, { DropDownItem } from 'components/base/DropDown'
import Text from 'components/base/Text'

import IconAngleDown from 'icons/AngleDown'
import IconArrowDown from 'icons/ArrowDown'
import IconArrowUp from 'icons/ArrowUp'

const OrderIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'dodgerBlue',
})`
  opacity: ${p => (p.isActive ? 1 : 0)};
`

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  orderAccounts: getOrderAccounts(state),
})

const mapDispatchToProps = {
  updateOrderAccounts,
  saveSettings,
}

type Props = {
  t: T,
  orderAccounts: string,
  updateOrderAccounts: Function,
  saveSettings: Function,
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
      const { updateOrderAccounts, saveSettings } = this.props
      this.setState({ cachedValue: order }, () => {
        window.requestIdleCallback(() => {
          updateOrderAccounts(order)
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
        label: t('orderAccounts.name'),
      },
      {
        key: 'balance',
        label: t('orderAccounts.balance'),
      },
      {
        key: 'type',
        label: t('orderAccounts.type'),
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
          {order === 'desc' ? (
            <IconArrowUp height={14} width={14} />
          ) : (
            <IconArrowDown height={14} width={14} />
          )}
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
          {'Sort by'}
        </Text>
        <Box
          alignItems="center"
          color="dark"
          ff="Open Sans|SemiBold"
          flow={1}
          fontSize={4}
          horizontal
        >
          <Text color="dark">{t(`orderAccounts.${this.getCurrentValue() || 'balance'}`)}</Text>
          <IconAngleDown height={7} width={8} />
        </Box>
      </DropDown>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(AccountsOrder)
