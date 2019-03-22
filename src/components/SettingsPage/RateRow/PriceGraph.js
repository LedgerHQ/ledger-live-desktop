// @flow
import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import { VictoryLine } from 'victory'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import CounterValues from 'helpers/countervalues'

const DAY = 24 * 60 * 60 * 1000
const mapStateToProps = (state, props: *) => {
  const data = []
  let t = Date.now() - props.days * DAY
  const value = BigNumber(10 ** props.from.units[0].magnitude)
  for (let i = 0; i < props.days; i++) {
    const date = new Date(t)
    const cv = CounterValues.calculateSelector(state, {
      ...props,
      date,
      value,
    })
    data.push({
      date,
      value: cv ? cv.toNumber() : 0,
    })
    t += DAY
  }
  return { data }
}

class PriceGraph extends Component<{
  from: Currency, // eslint-disable-line
  to: Currency, // eslint-disable-line
  days: number, // eslint-disable-line
  exchange: ?string, // eslint-disable-line
  data: Array<{ date: Date, value: number }>,
  width: number,
  height: number,
}> {
  render() {
    const { width, height, data } = this.props
    return (
      <svg height={height} width={width}>
        <VictoryLine
          standalone={false}
          width={width}
          height={height}
          scale={{ x: 'time' }}
          x="date"
          y="value"
          data={data}
          padding={5}
          style={{
            data: {
              stroke: '#333',
              strokeWidth: 1,
            },
          }}
        />
      </svg>
    )
  }
}

export default connect(mapStateToProps)(PriceGraph)
