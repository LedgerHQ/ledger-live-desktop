// @flow
import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import CounterValues from 'helpers/countervalues'
import { PlaceholderLine } from 'components/Placeholder'
import { colors } from 'styles/theme'
import { rgba } from 'styles/helpers'
import { getDates } from '@ledgerhq/live-common/lib/portfolio'

const mapStateToProps = (state, props: *) => {
  const dates = getDates(props.timeRange)
  const data = []
  const value = BigNumber(10 ** props.from.units[0].magnitude)
  let nbCounterValueOff = 0
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i]
    const cv = CounterValues.calculateSelector(state, {
      ...props,
      date,
      value,
    })
    if (!cv) ++nbCounterValueOff
    data.push({
      date,
      value: cv ? cv.toNumber() : 0,
    })
  }
  return { data, isAvailable: nbCounterValueOff < dates.length }
}

class PriceGraph extends Component<{
  from: Currency, // eslint-disable-line
  to: Currency, // eslint-disable-line
  exchange: ?string, // eslint-disable-line
  isAvailable: boolean,
  data: Array<{ date: Date, value: number }>,
  width: number,
  height: number,
  placeholder: ?any,
}> {
  render() {
    const { isAvailable, data, width, height, from, to, placeholder } = this.props
    if (!isAvailable) {
      return placeholder !== undefined ? placeholder : <PlaceholderLine width={16} height={2} />
    }
    const x = d3
      .scaleLinear()
      .domain([d3.min(data, d => d.date), d3.max(data, d => d.date)])
      .range([0, width])

    const y = d3
      .scaleLinear()
      .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)])
      .range([height, 0])

    const path = d3
      .area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.value))(data)

    const line = d3
      .line()
      .x(d => x(d.date))
      .y(d => y(d.value))(data)
    const color = colors[to.type === 'FiatCurrency' ? 'wallet' : 'identity']
    const gradientId = `gradient-rates-${from.ticker}-to-${to.ticker}}`

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop stopColor={rgba(color, 0.3)} offset="0" />
            <stop stopColor={rgba(color, 0)} offset="1" />
          </linearGradient>
        </defs>
        <path d={path} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" strokeWidth={1} stroke={color} />
      </svg>
    )
  }
}

export default connect(mapStateToProps)(PriceGraph)
