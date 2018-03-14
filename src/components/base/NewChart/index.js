// @flow

/**
 *                                   Chart
 *                                   -----
 *
 *                                    XX
 *                                   XXXX
 *                          X       XX  X
 *                         XXXX    XX   X
 *                        XX  X  XX     X
 *                       X    XXXX       X     XX    X
 *                      XX     XX        X   XX XX  XX
 *                     XX                XX XX   XXXX
 *                                        XX
 *                                        XX
 *  Usage:
 *
 *    <Chart
 *      data={data}
 *      interactive       // Handle mouse events, display tooltip etc.
 *      color="#5f8ced"   // Main color for line, gradient, etc.
 *      height={300}      // Fix height. Width is responsive to container.
 *    />
 *
 *    `data` looks like:
 *
 *     [
 *       { date: '2018-01-01', value: 10 },
 *       { date: '2018-01-02', value: 25 },
 *       { date: '2018-01-03', value: 50 },
 *     ]
 *
 */

import React, { PureComponent } from 'react'
import * as d3 from 'd3'
import noop from 'lodash/noop'

import type { Unit } from '@ledgerhq/currencies'

import refreshNodes from './refreshNodes'
import refreshDraw from './refreshDraw'
import handleMouseEvents from './handleMouseEvents'
import { enrichData, generateColors, generateMargins, observeResize } from './helpers'

import type { Data } from './types'

export type Props = {
  data: Data, // eslint-disable-line react/no-unused-prop-types
  unit: Unit, // eslint-disable-line react/no-unused-prop-types

  id?: string, // eslint-disable-line react/no-unused-prop-types
  height?: number,
  tickXScale: string, // eslint-disable-line react/no-unused-prop-types
  color?: string, // eslint-disable-line react/no-unused-prop-types
  hideAxis?: boolean, // eslint-disable-line react/no-unused-prop-types
  dateFormat?: string, // eslint-disable-line react/no-unused-prop-types
  interactive?: boolean, // eslint-disable-line react/no-unused-prop-types
  renderTooltip?: Function, // eslint-disable-line react/no-unused-prop-types
}

class Chart extends PureComponent<Props> {
  static defaultProps = {
    id: 'chart',
    color: '#000',
    hideAxis: false,
    interactive: true,
    height: 400,
    dateFormat: '%Y-%m-%d',
    tickXScale: 'month',
  }

  componentDidMount() {
    const { width } = this._ruler.getBoundingClientRect()
    this._width = width
    this.createChart()
    observeResize(this._ruler, width => {
      if (width !== this._width) {
        this._width = width
        this.refreshChart(this.props)
      }
    })
  }

  componentDidUpdate(prevProps: Props) {
    this.refreshChart(prevProps)
  }

  _ruler: any
  _node: any
  _width: number
  refreshChart: Function

  createChart() {
    const ctx = {
      NODES: {},
      INVALIDATED: {},
      MARGINS: {},
      COLORS: {},
      DATA: [],
      WIDTH: 0,
      HEIGHT: 0,
      x: noop,
      y: noop,
    }

    let firstRender = true

    // Keep reference to mouse handler to allow destroy when refresh
    let mouseHandler = null

    this.refreshChart = prevProps => {
      const { _node: node, props } = this
      const { data: raw, color, dateFormat, height, hideAxis, interactive, renderTooltip } = props

      ctx.DATA = enrichData(raw, d3.timeParse(dateFormat))

      // Detect what needs to be updated
      ctx.INVALIDATED = {
        color: firstRender || (prevProps && color !== prevProps.color),
        margin: firstRender || (prevProps && hideAxis !== prevProps.hideAxis),
      }
      firstRender = false

      // Reset color if needed
      if (ctx.INVALIDATED.color) {
        ctx.COLORS = generateColors(color)
      }

      // Reset margins if needed
      if (ctx.INVALIDATED.margin) {
        ctx.MARGINS = generateMargins(hideAxis)
      }

      // Derived draw variables
      ctx.HEIGHT = Math.max(0, (height || 0) - ctx.MARGINS.top - ctx.MARGINS.bottom)
      ctx.WIDTH = Math.max(0, this._width - ctx.MARGINS.left - ctx.MARGINS.right)

      // Scales and areas
      const x = d3.scaleTime().range([0, ctx.WIDTH])
      const y = d3.scaleLinear().range([ctx.HEIGHT, 0])
      x.domain(d3.extent(ctx.DATA, d => d.parsedDate))
      y.domain([0, d3.max(ctx.DATA, d => d.value)])
      ctx.x = x
      ctx.y = y

      // Reference to last tooltip, to prevent un-necessary re-render
      let lastDisplayedTooltip = null

      // Add/remove nodes depending on props
      refreshNodes({ ctx, node, props })

      // Redraw
      refreshDraw({ ctx, props })

      // Mouse handler
      mouseHandler && mouseHandler.remove() // eslint-disable-line no-unused-expressions
      if (interactive) {
        mouseHandler = handleMouseEvents({
          ctx,
          props,
          shouldTooltipUpdate: d => d !== lastDisplayedTooltip,
          onTooltipUpdate: d => (lastDisplayedTooltip = d),
          renderTooltip,
        })
      }
    }

    this.refreshChart()
  }

  render() {
    const { height } = this.props
    return (
      <div style={{ position: 'relative', height }} ref={n => (this._ruler = n)}>
        <div
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          ref={n => (this._node = n)}
        />
      </div>
    )
  }
}

export default Chart
