// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import type { TokenAccount, Account } from '@ledgerhq/live-common/lib/types'

import Box from 'components/base/Box'
import Ellipsis from 'components/base/Ellipsis'
import Text from 'components/base/Text'
import CryptoCurrencyIcon from '../CryptoCurrencyIcon'

const CurName = styled(Text).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 2,
})`
  text-transform: uppercase;
  letter-spacing: 1px;
`

const AccountName = styled(Text).attrs({
  color: 'dark',
  ff: 'Museo Sans',
  fontSize: 7,
})`
  line-height: 1.1;
`

type Props = {
  account: TokenAccount | Account,
  parentAccount?: Account,
}

class AccountHeader extends PureComponent<Props> {
  render() {
    const { account, parentAccount } = this.props
    const mainAccount = account.type === 'Account' ? account : parentAccount
    if (!mainAccount) return null
    const currency = account.type === 'Account' ? account.currency : account.token
    return (
      <Box horizontal align="center" flow={2} grow>
        <Box>
          <CryptoCurrencyIcon currency={currency} size={24} />
        </Box>
        <Box grow>
          <CurName>{currency.name}</CurName>
          <AccountName>
            <Ellipsis>{account.type === 'Account' ? account.name : null}</Ellipsis>
          </AccountName>
        </Box>
      </Box>
    )
  }
}

export default AccountHeader
