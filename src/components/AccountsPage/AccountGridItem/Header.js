// @flow

import React, { PureComponent } from 'react'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import Bar from 'components/base/Bar'
import Ellipsis from 'components/base/Ellipsis'
import FormattedVal from 'components/base/FormattedVal'
import ParentCryptoCurrencyIcon from 'components/ParentCryptoCurrencyIcon'
import AccountSyncStatusIndicator from '../AccountSyncStatusIndicator'

class HeadText extends PureComponent<{
  title: string,
  name: string,
}> {
  render() {
    const { title, name } = this.props
    return (
      <Box grow>
        <Box style={{ textTransform: 'uppercase' }} fontSize={10} color="graphite">
          {title}
        </Box>
        <Ellipsis fontSize={13} color="dark">
          {name}
        </Ellipsis>
      </Box>
    )
  }
}

class Header extends PureComponent<{
  account: Account | TokenAccount,
  parentAccount?: Account,
}> {
  render() {
    const { account, parentAccount } = this.props
    let currency
    let unit
    let title
    let name

    if (account.type !== 'Account') {
      currency = account.token
      unit = account.token.units[0]
      title = 'token'
      name = currency.name

      if (!parentAccount) return null
    } else {
      currency = account.currency
      unit = account.unit
      title = currency.name
      name = account.name
    }

    return (
      <Box flow={4}>
        <Box horizontal ff="Open Sans|SemiBold" flow={3} alignItems="center">
          <ParentCryptoCurrencyIcon currency={currency} parent={parentAccount} />
          <HeadText name={name} title={title} />
          <AccountSyncStatusIndicator
            accountId={(parentAccount && parentAccount.id) || account.id}
            account={account}
          />
        </Box>
        <Bar size={1} color="fog" />
        <Box justifyContent="center">
          <FormattedVal
            alwaysShowSign={false}
            animateTicker={false}
            ellipsis
            color="dark"
            unit={unit}
            showCode
            val={account.balance}
          />
        </Box>
      </Box>
    )
  }
}

export default Header
