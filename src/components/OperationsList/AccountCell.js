// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Ellipsis from 'components/base/Ellipsis'
import Tooltip from 'components/base/Tooltip'

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
        <Tooltip delay={1200} content={accountName}>
          <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
            {accountName}
          </Ellipsis>
        </Tooltip>
      </Cell>
    )
  }
}

export default AccountCell
