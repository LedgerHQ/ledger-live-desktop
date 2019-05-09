// @flow

import React, { PureComponent } from 'react'
import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import Bar from 'components/base/Bar'
import Ellipsis from 'components/base/Ellipsis'
import FormattedVal from 'components/base/FormattedVal'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import AccountSyncStatusIndicator from '../AccountSyncStatusIndicator'

class CurrencyHead extends PureComponent<{
  currency: CryptoCurrency,
}> {
  render() {
    const { currency } = this.props
    return (
      <Box alignItems="center" justifyContent="center" style={{ color: currency.color }}>
        <CryptoCurrencyIcon currency={currency} size={20} />
      </Box>
    )
  }
}

class HeadText extends PureComponent<{
  currency: CryptoCurrency,
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
  account: Account,
}> {
  render() {
    const { account } = this.props
    return (
      <Box flow={4}>
        <Box horizontal ff="Open Sans|SemiBold" flow={3} alignItems="center">
          <CurrencyHead currency={account.currency} />
          <HeadText name={account.name} currency={account.currency} />
          <AccountSyncStatusIndicator accountId={account.id} account={account} />
        </Box>
        <Bar size={1} color="fog" />
        <Box justifyContent="center">
          <FormattedVal
            alwaysShowSign={false}
            animateTicker={false}
            ellipsis
            color="dark"
            unit={account.unit}
            showCode
            val={account.balance}
          />
        </Box>
      </Box>
    )
  }
}

export default Header
