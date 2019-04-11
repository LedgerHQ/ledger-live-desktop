// @flow

import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Chart from 'components/base/Chart'

type Props = {
  chartId: string,
  data: Array<*>,
  tickXScale: PortfolioRange,
}

export default class PlaceholderChart extends Component<Props> {
  shouldComponentUpdate(next: Props) {
    return next.tickXScale !== this.props.tickXScale
  }
  render() {
    const { chartId, data, tickXScale } = this.props
    return (
      <Chart
        id={chartId}
        color="rgba(0,0,0,0.04)"
        data={data.map(i => ({
          ...i,
          value: BigNumber(
            10000 *
              (1 +
              0.1 * Math.sin(i.date * Math.cos(Number(i.date))) + // random-ish
                0.5 * Math.cos(i.date / 2000000000 + Math.sin(i.date / 1000000000))),
          ), // general curve trend
        }))}
        height={200}
        tickXScale={tickXScale}
        renderTickY={() => ''}
      />
    )
  }
}
