// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import CryptoCurrencyIcon from '../../CryptoCurrencyIcon'
import Ellipsis from '../../base/Ellipsis'

type Props = {
  currency: CryptoCurrency,
  name: string,
}

class Head extends PureComponent<Props> {
  render() {
    const { currency, name } = this.props
    return (
      <Box horizontal ff="Open Sans|SemiBold" flow={3} flex="30%" alignItems="center">
        <Box alignItems="center" justifyContent="center" style={{ color: currency.color }}>
          <CryptoCurrencyIcon currency={currency} size={20} />
        </Box>
        <Box grow>
          <Box style={{ textTransform: 'uppercase' }} fontSize={9} color="graphite">
            {currency.name}
          </Box>
          <Ellipsis fontSize={12} color="dark">
            {name}
          </Ellipsis>
        </Box>
      </Box>
    )
  }
}

export default Head
