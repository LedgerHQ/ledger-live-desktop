// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import { colors } from 'styles/theme'
import { getAccountCurrency } from '@ledgerhq/live-common/lib/account'
import type { AccountLike } from '@ledgerhq/live-common/lib/types/account'
import styled from 'styled-components'
import CryptoCurrencyIcon from '../../CryptoCurrencyIcon'
import Ellipsis from '../../base/Ellipsis'

type Props = {
  account: AccountLike,
  name: string,
  nested?: boolean,
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
    const { account, name, nested } = this.props
    const currency = getAccountCurrency(account)
    const color = currency.type === 'CryptoCurrency' ? currency.color : colors.grey
    const title = currency.type === 'CryptoCurrency' ? currency.name : 'token'
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
            <Box style={{ textTransform: 'uppercase' }} fontSize={9} color="grey">
              {title}
            </Box>
          )}
          <Ellipsis fontSize={12} color="dark">
            {name}
          </Ellipsis>
        </Box>
      </Box>
    )
  }
}

export default Header
