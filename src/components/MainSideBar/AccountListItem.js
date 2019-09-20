// @flow

import React, { PureComponent } from 'react'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'

import type { Account } from '@ledgerhq/live-common/lib/types'

import FormattedVal from 'components/base/FormattedVal'
import { SideBarListItem } from 'components/base/SideBar'

export default class AccountListItem extends PureComponent<{
  account: Account,
  push: string => void,
  isActive: boolean,
}> {
  render() {
    const { account, push, isActive } = this.props
    const accountURL = `/account/${account.id}`
    const item = {
      label: account.name,
      desc: () => (
        <FormattedVal
          alwaysShowSign={false}
          color="palette.text.shade80"
          unit={account.unit}
          showCode
          val={account.balance || 0}
        />
      ),
      iconActiveColor: account.currency.color,
      icon: getCryptoCurrencyIcon(account.currency),
      onClick: () => push(accountURL),
      isActive,
    }
    return <SideBarListItem {...item} />
  }
}
