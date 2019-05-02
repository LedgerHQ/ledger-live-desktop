// @flow

import React, { PureComponent } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'

class Balance extends PureComponent<{
  account: Account,
}> {
  render() {
    const { account, ...rest } = this.props
    return (
      <Box {...rest} justifyContent="center">
        <FormattedVal
          alwaysShowSign={false}
          animateTicker={false}
          ellipsis
          color="dark"
          unit={account.unit}
          showCode
          val={account.balance}
        />
      </Box>
    )
  }
}

export default Balance
