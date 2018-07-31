// @flow

import React, { PureComponent } from 'react'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import Ellipsis from 'components/base/Ellipsis'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'

class AccountCardHeader extends PureComponent<{
  currency: CryptoCurrency,
  accountName: string,
}> {
  render() {
    const { currency, accountName } = this.props
    return (
      <Box horizontal ff="Open Sans|SemiBold" flow={3} alignItems="center">
        <Box alignItems="center" justifyContent="center" style={{ color: currency.color }}>
          <CryptoCurrencyIcon currency={currency} size={20} />
        </Box>
        <Box grow>
          <Box style={{ textTransform: 'uppercase' }} fontSize={0} color="graphite">
            {currency.name}
          </Box>
          <Ellipsis fontSize={4} color="dark">
            {accountName}
          </Ellipsis>
        </Box>
      </Box>
    )
  }
}

export default AccountCardHeader
