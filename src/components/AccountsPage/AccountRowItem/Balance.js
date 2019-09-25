// @flow

import type { BigNumber } from 'bignumber.js'
import React, { PureComponent } from 'react'
import type { Unit } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'

class Balance extends PureComponent<{
  unit: Unit,
  balance: BigNumber,
  disableRounding?: boolean,
}> {
  render() {
    const { unit, balance, disableRounding } = this.props
    return (
      <Box flex="30%" justifyContent="center" fontSize={4}>
        <FormattedVal
          alwaysShowSign={false}
          animateTicker={false}
          ellipsis
          color="palette.text.shade100"
          unit={unit}
          showCode
          val={balance}
          disableRounding={disableRounding}
        />
      </Box>
    )
  }
}

export default Balance
