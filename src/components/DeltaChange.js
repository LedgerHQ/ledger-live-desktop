// @flow
import React, { PureComponent } from 'react'
import FormattedVal from 'components/base/FormattedVal'

class DeltaChange extends PureComponent<{
  from: number,
  to: number,
}> {
  render() {
    const { from, to, ...rest } = this.props
    const val = from ? Math.floor((to - from) / from * 100) : 0
    // TODO in future, we also want to diverge rendering when the % is way too high (this can easily happen)
    return <FormattedVal isPercent val={val} {...rest} />
  }
}

export default DeltaChange
