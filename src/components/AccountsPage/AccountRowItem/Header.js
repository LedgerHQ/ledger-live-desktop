// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import { getAccountCurrency, getAccountName } from '@ledgerhq/live-common/lib/account'
import type { AccountLike } from '@ledgerhq/live-common/lib/types/account'
import styled, { withTheme } from 'styled-components'
import Ellipsis from 'components/base/Ellipsis'
import Tooltip from 'components/base/Tooltip'
import CryptoCurrencyIcon from '../../CryptoCurrencyIcon'

type Props = {
  account: AccountLike,
  nested?: boolean,
  theme: any,
}

// NB Inside Head to not break alignment with parent row;
// and this is in fact not seen, because we draw on top
// from AccountRowItem/index.js TokenBarIndicator
const NestedIndicator = styled.div`
  height: 44px;
  width: 14px;
`

class Header extends PureComponent<Props> {
  render() {
    const { account, nested, theme } = this.props
    const currency = getAccountCurrency(account)
    const name = getAccountName(account)
    const color =
      currency.type === 'CryptoCurrency' ? currency.color : theme.colors.palette.text.shade60
    const title = currency.type === 'CryptoCurrency' ? currency.name : 'token'
    return (
      <Box
        horizontal
        ff="Inter|SemiBold"
        flow={3}
        flex={`${nested ? 42 : 30}%`}
        pr={1}
        alignItems="center"
      >
        {nested && <NestedIndicator />}
        <Box alignItems="center" justifyContent="center" style={{ color }}>
          <CryptoCurrencyIcon currency={currency} size={20} />
        </Box>
        <Box grow>
          {!nested && account.type === 'Account' && (
            <Box style={{ textTransform: 'uppercase' }} fontSize={9} color="palette.text.shade60">
              {title}
            </Box>
          )}
          <Tooltip delay={1200} content={name}>
            <Ellipsis fontSize={12} color="palette.text.shade100">
              {name}
            </Ellipsis>
          </Tooltip>
        </Box>
      </Box>
    )
  }
}

export default withTheme(Header)
