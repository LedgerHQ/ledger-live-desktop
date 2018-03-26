// @flow

import React, { PureComponent } from 'react'
import { getIconByCoinType } from '@ledgerhq/currencies/react'
import styled from 'styled-components'

import type { Account } from '@ledgerhq/wallet-common/lib/types'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

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
  line-height: 1;
`

type Props = {
  account: Account,
}

class AccountHeader extends PureComponent<Props> {
  render() {
    const { account } = this.props
    const Icon = getIconByCoinType(account.currency.coinType)
    return (
      <Box horizontal align="center" flow={2}>
        {Icon && (
          <Box color={account.currency.color}>
            <Icon size={24} />
          </Box>
        )}
        <Box>
          <CurName>{account.currency.name}</CurName>
          <AccountName>{account.name}</AccountName>
        </Box>
      </Box>
    )
  }
}

export default AccountHeader
