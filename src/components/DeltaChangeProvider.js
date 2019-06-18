// @flow
import { PureComponent } from 'react'
import { BigNumber } from 'bignumber.js'

const highThreshold = 9999

class DeltaChangeProvider extends PureComponent<{
  from: BigNumber,
  to: BigNumber,
  children: Function,
}> {
  render() {
    const { from, to, children } = this.props
    if (from.isZero()) return null
    const val = to
      .minus(from)
      .div(from)
      .times(100)
      .integerValue()
    if (val.isGreaterThan(highThreshold)) return null

    return children({ deltaValue: val })
  }
}

export default DeltaChangeProvider
