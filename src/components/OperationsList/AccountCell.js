// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'

const Cell = styled(Box).attrs({
  px: 4,
  horizontal: true,
  alignItems: 'center',
})`
  width: 150px;
  overflow: hidden;
`

type Props = {
  currency: Currency,
  accountName: string,
}

class AccountCell extends PureComponent<Props> {
  render() {
    const { currency, accountName } = this.props
    const Icon = getCryptoCurrencyIcon(currency)
    return (
      <Cell horizontal flow={2}>
        <Box alignItems="center" justifyContent="center" style={{ color: currency.color }}>
          {Icon && <Icon size={16} />}
        </Box>
        <Box ff="Open Sans|SemiBold" fontSize={3} color="dark">
          {accountName}
        </Box>
      </Cell>
    )
  }
}

export default AccountCell
