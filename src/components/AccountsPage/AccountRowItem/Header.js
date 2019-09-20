// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import styled, { withTheme } from 'styled-components'
import CryptoCurrencyIcon from '../../CryptoCurrencyIcon'
import Ellipsis from '../../base/Ellipsis'

type Props = {
  account: Account | TokenAccount,
  name: string,
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
    const { account, name, nested, theme } = this.props
    let currency
    let color
    let title

    if (account.type === 'Account') {
      currency = account.currency
      color = currency.color
      title = currency.name
    } else {
      currency = account.token
      color = theme.colors.palette.text.shade60
      title = 'token'
    }
    return (
      <Box
        horizontal
        ff="Open Sans|SemiBold"
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
          <Ellipsis fontSize={12} color="palette.text.shade100">
            {name}
          </Ellipsis>
        </Box>
      </Box>
    )
  }
}

export default withTheme(Header)
