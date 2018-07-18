// @flow
import React, { PureComponent } from 'react'
import { BigNumber } from 'bignumber.js'
import FormattedVal from 'components/base/FormattedVal'

class DeltaChange extends PureComponent<{
  from: BigNumber,
  to: BigNumber,
}> {
  render() {
    const { from, to, ...rest } = this.props
    const val = !from.isZero()
      ? to
          .minus(from)
          .div(from)
          .times(100)
          .integerValue()
      : BigNumber(0)
    // TODO in future, we also want to diverge rendering when the % is way too high (this can easily happen)
    return <FormattedVal isPercent val={val} {...rest} />
  }
}

export default DeltaChange
