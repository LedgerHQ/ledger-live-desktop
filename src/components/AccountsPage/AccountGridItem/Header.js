// @flow

import React, { PureComponent } from 'react'
import type { Account, TokenAccount, Currency } from '@ledgerhq/live-common/lib/types'
import styled from 'styled-components'
import Box from 'components/base/Box'
import Bar from 'components/base/Bar'
import Ellipsis from 'components/base/Ellipsis'
import FormattedVal from 'components/base/FormattedVal'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import AccountSyncStatusIndicator from '../AccountSyncStatusIndicator'

const CryptoCurrencyIconWrapper = styled.div`
  > :nth-child(2) {
    margin-top: -13px;
    margin-left: 8px;
    border: 2px solid white;
  }
`

class CurrencyHead extends PureComponent<{
  currency: Currency,
  parentCurrency?: Currency,
}> {
  render() {
    const { currency, parentCurrency } = this.props
    const double = !!parentCurrency

    return (
      <CryptoCurrencyIconWrapper>
        {parentCurrency && <CryptoCurrencyIcon currency={parentCurrency} size={double ? 16 : 20} />}
        <CryptoCurrencyIcon currency={currency} size={double ? 16 : 20} />
      </CryptoCurrencyIconWrapper>
    )
  }
}

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
  parentAccount: ?Account,
}> {
  render() {
    const { account, parentAccount } = this.props
    let currency
    let unit
    let mainAccount
    let title
    let name

    if (account.type !== 'Account') {
      currency = account.token
      unit = account.token.units[0]
      mainAccount = parentAccount
      title = 'token'
      name = currency.name

      if (!mainAccount) return null
    } else {
      currency = account.currency
      unit = account.unit
      mainAccount = account
      title = currency.name
      name = mainAccount.name
    }

    return (
      <Box flow={4}>
        <Box horizontal ff="Open Sans|SemiBold" flow={3} alignItems="center">
          <CurrencyHead currency={currency} parentCurrency={mainAccount && mainAccount.currency} />
          <HeadText name={name} title={title} />
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
