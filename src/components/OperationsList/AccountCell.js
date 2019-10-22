// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'

const Cell = styled(Box).attrs(() => ({
  px: 4,
  horizontal: true,
  alignItems: 'center',
}))`
  flex: 1;
  overflow: hidden;
  max-width: 400px;
`

type Props = {
  currency: Currency,
  accountName: string,
}

class AccountCell extends PureComponent<Props> {
  render() {
    const { currency, accountName } = this.props
    return (
      <Cell horizontal flow={2}>
        <Box alignItems="center" justifyContent="center">
          <CryptoCurrencyIcon size={16} currency={currency} />
        </Box>
        <AccountNameEllipsis>{accountName}</AccountNameEllipsis>
      </Cell>
    )
  }
}

export default AccountCell

const AccountNameEllipsis = styled(Box).attrs(() => ({
  ff: 'Inter|SemiBold',
  fontSize: 3,
  color: 'palette.text.shade100',
  flexShrink: 1,
}))`
  flex: 1;
  min-width: 0;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
