// @flow
/* eslint-disable react/no-unused-prop-types */

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
 *      isInteractive     // Handle mouse events, display tooltip etc.
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

import React, { Component } from 'react'
import * as d3 from 'd3'
import noop from 'lodash/noop'
import last from 'lodash/last'
import styled, { withTheme } from 'styled-components'
import debounce from 'lodash/debounce'

import refreshNodes from './refreshNodes'
import refreshDraw from './refreshDraw'
import handleMouseEvents from './handleMouseEvents'
import { enrichData, generateColors, generateMargins, observeResize } from './helpers'

import type { Data } from './types'

export type Props = {
  data: Data,
  id?: string,
  height?: number,
  tickXScale: string,
  color?: string,
  hideAxis?: boolean,
  dateFormat?: string,
  isInteractive?: boolean,
  renderTooltip?: Function,
  renderTickY: (t: number) => string | number,
  mapValue: (*) => number,
  onlyUpdateIfLastPointChanges?: boolean,
  theme: any,
}

class Chart extends Component<Props> {
  static defaultProps = {
    color: '#000',
    dateFormat: '%Y-%m-%d',
    height: 400,
    hideAxis: false,
    id: 'chart',
    isInteractive: true,
    tickXScale: 'month',
    renderTickY: (t: *) => t,
    mapValue: (d: *) => d.value.toNumber(),
  }

  componentDidMount() {
    const { width } = this._ruler.getBoundingClientRect()
    this._width = width
    this.createChart()
    if (this.props.isInteractive) {
      this.subResize = observeResize(this._ruler, width => {
        if (width !== this._width) {
          this._width = width
          this.refreshChart(this.props)
        }
      })
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const lastPointChanges =
      nextProps.mapValue(last(nextProps.data)) !== this.props.mapValue(last(this.props.data))
    return (
      lastPointChanges ||
      nextProps.id !== this.props.id ||
      nextProps.height !== this.props.height ||
      nextProps.tickXScale !== this.props.tickXScale ||
      nextProps.color !== this.props.color ||
      nextProps.hideAxis !== this.props.hideAxis ||
      nextProps.dateFormat !== this.props.dateFormat ||
      nextProps.isInteractive !== this.props.isInteractive ||
      nextProps.data.length !== this.props.data.length ||
      (nextProps.onlyUpdateIfLastPointChanges ? false : nextProps.data !== this.props.data)
    )
  }

  componentDidUpdate(prevProps: Props) {
    this.refreshChart(prevProps)
  }

  componentWillUnmount() {
    if (this.subResize) this.subResize()
  }

  subResize: *
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

    const refreshToolTip = debounce(() => {
      const { props } = this
      const { isInteractive, renderTooltip, theme } = props

      // Reference to last tooltip, to prevent un-necessary re-render
      let lastDisplayedTooltip = null

      // Mouse handler
      mouseHandler && mouseHandler.remove() // eslint-disable-line no-unused-expressions
      if (isInteractive) {
        mouseHandler = handleMouseEvents({
          ctx,
          theme,
          shouldTooltipUpdate: d => d !== lastDisplayedTooltip,
          onTooltipUpdate: d => (lastDisplayedTooltip = d),
          renderTooltip,
          mapValue: props.mapValue,
        })
      }
    }, 200)

    this.refreshChart = prevProps => {
      const { _node: node, props } = this
      const { data: raw, color, height, hideAxis, mapValue, theme } = props

      ctx.DATA = enrichData(raw)

      // Detect what needs to be updated
      ctx.INVALIDATED = {
        color: firstRender || (prevProps && color !== prevProps.color),
        margin: firstRender || (prevProps && hideAxis !== prevProps.hideAxis),
      }
      firstRender = false

      // Reset color if needed
      if (ctx.INVALIDATED.color) {
        ctx.COLORS = generateColors(theme, color)
      }

      // Reset margins if needed
      if (ctx.INVALIDATED.margin) {
        ctx.MARGINS = generateMargins(hideAxis)
      }

      // Derived draw variables
      ctx.HEIGHT = Math.max(0, (height || 0) - ctx.MARGINS.top - ctx.MARGINS.bottom)
      ctx.WIDTH = Math.max(0, this._width - ctx.MARGINS.left - ctx.MARGINS.right)

      const [min, max] = d3.extent(ctx.DATA, mapValue)

      // Scales and areas
      const x = d3
        .scaleTime()
        .range([0, ctx.WIDTH])
        .domain(d3.extent(ctx.DATA, d => d.parsedDate))
      const y = d3
        .scaleLinear()
        .range([ctx.HEIGHT, 0])
        .domain([0.8 * min, max])
      ctx.x = x
      ctx.y = y

      // Add/remove nodes depending on props
      refreshNodes(theme, { ctx, node, props })

      // Redraw
      refreshDraw(theme, { ctx, props })

      // Refreshing tooltip
      refreshToolTip()
    }

    this.refreshChart()
  }

  render() {
    const { height, hideAxis } = this.props
    return (
      <Ruler height={height} hideAxis={hideAxis} ref={n => (this._ruler = n)}>
        <div
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          ref={n => (this._node = n)}
        />
      </Ruler>
    )
  }
}

const Ruler = styled.div.attrs(({ height }) => ({
  style: {
    height,
  },
}))`
  position: relative;
  width: 100%;
`

export default withTheme(Chart)
