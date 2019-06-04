// @flow

import React, { PureComponent } from 'react'
import type { Account, TokenAccount, Currency } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import Bar from 'components/base/Bar'
import Ellipsis from 'components/base/Ellipsis'
import FormattedVal from 'components/base/FormattedVal'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import AccountSyncStatusIndicator from '../AccountSyncStatusIndicator'

class CurrencyHead extends PureComponent<{
  currency: Currency,
}> {
  render() {
    const { currency } = this.props
    return (
      <Box alignItems="center" justifyContent="center">
        <CryptoCurrencyIcon currency={currency} size={20} />
      </Box>
    )
  }
}

class HeadText extends PureComponent<{
  currency: Currency,
  name: string,
}> {
  render() {
    const { currency, name } = this.props
    return (
      <Box grow>
        <Box style={{ textTransform: 'uppercase' }} fontSize={10} color="graphite">
          {currency.name}
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
  parentAccount: ?Account,
}> {
  render() {
    const { account, parentAccount } = this.props
    const mainAccount = account.type === 'Account' ? account : parentAccount
    if (!mainAccount) return null
    const currency = account.type === 'Account' ? account.currency : account.token
    const unit = account.type === 'Account' ? account.unit : account.token.units[0]
    return (
      <Box flow={4}>
        <Box horizontal ff="Open Sans|SemiBold" flow={3} alignItems="center">
          <CurrencyHead currency={currency} />
          <HeadText name={mainAccount.name} currency={currency} />
          <AccountSyncStatusIndicator accountId={mainAccount.id} account={account} />
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
