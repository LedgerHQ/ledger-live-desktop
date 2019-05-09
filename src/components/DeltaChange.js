// @flow
import React, { PureComponent } from 'react'
import { BigNumber } from 'bignumber.js'
import FormattedVal from 'components/base/FormattedVal'

const highThreshold = 9999

class DeltaChange extends PureComponent<{
  from: BigNumber,
  to: BigNumber,
  placeholder: React$Node,
}> {
  static defaultProps = {
    placeholder: null,
  }
  render() {
    const { from, to, placeholder, ...rest } = this.props
    if (from.isZero()) return placeholder
    const val = to
      .minus(from)
      .div(from)
      .times(100)
      .integerValue()
    if (val.isGreaterThan(highThreshold)) return placeholder
    return <FormattedVal isPercent val={val} {...rest} />
  }
}

export default DeltaChange
