// @flow

import React, { Component } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'

import type { T } from 'types/common'

import { getOrderAccounts } from 'reducers/settings'

import { updateOrderAccounts } from 'actions/accounts'
import { saveSettings } from 'actions/settings'

import DropDown from 'components/base/DropDown'
import Text from 'components/base/Text'
import IconAngleDown from 'icons/AngleDown'

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

  setAccountOrder = order => {
    const { updateOrderAccounts, saveSettings } = this.props
    this.setState({ cachedValue: order }, () => {
      window.requestIdleCallback(() => {
        updateOrderAccounts(order)
        saveSettings({ orderAccounts: order })
      })
    })
  }

  render() {
    const { t } = this.props
    const { cachedValue } = this.state

    const sortItems = [
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
    ]

    return (
      <DropDown
        onChange={item => this.setAccountOrder(item.key)}
        items={sortItems}
        ff="Open Sans|SemiBold"
        fontSize={4}
        flow={1}
        color="dark"
        horizontal
        alignItems="center"
      >
        <Text color="dark">{t(`orderAccounts.${cachedValue || 'balance'}`)}</Text>
        <IconAngleDown height={7} width={8} />
      </DropDown>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(AccountsOrder)
