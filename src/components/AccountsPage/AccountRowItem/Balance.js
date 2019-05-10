// @flow

import type { BigNumber } from 'bignumber.js'
import React, { PureComponent } from 'react'
import type { Unit } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'

class Balance extends PureComponent<{
  unit: Unit,
  balance: BigNumber,
}> {
  render() {
    const { unit, balance } = this.props
    return (
      <Box flex="30%" justifyContent="center">
        <FormattedVal
          alwaysShowSign={false}
          animateTicker={false}
          ellipsis
          color="dark"
          unit={unit}
          showCode
          val={balance}
          disableRounding
        />
      </Box>
    )
  }
}

export default Balance
