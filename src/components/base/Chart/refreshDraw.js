// @flow

import * as d3 from 'd3'
import moment from 'moment'

import type { Props } from '.'
import type { CTX } from './types'

const TICK_X_SCALE = {
  week: 7,
  month: 7,
  year: 13,
  default: 10,
}

function getTickXCount(tickXScale) {
  return TICK_X_SCALE[tickXScale] || TICK_X_SCALE.default
}

const RENDER_TICK_X = {
  year: 'MMM',
  default: 'MMM D',
}

function getRenderTickX(selectedTimeRange) {
  return t => moment(t).format(RENDER_TICK_X[selectedTimeRange] || RENDER_TICK_X.default)
}

export default function refreshDraw(theme: any, { ctx, props }: { ctx: CTX, props: Props }) {
  const { NODES, WIDTH, HEIGHT, MARGINS, COLORS, INVALIDATED, DATA, x, y } = ctx
  const { hideAxis, isInteractive, tickXScale, renderTickY, mapValue } = props

  const transition = '1s'

  const nbTicksX = getTickXCount(tickXScale)
  const renderTickX = getRenderTickX(tickXScale)

  // NB this is a hack because can't figure out how
  const nearZero = d3.min(DATA, mapValue) === 0

  const area = d3
    .area()
    .x(d => x(d.parsedDate))
    .y0(HEIGHT)
    .y1(d => y(mapValue(d)))

  const valueline = d3
    .line()
    .x(d => x(d.parsedDate))
    .y(d => y(mapValue(d)))

  // Resize container
  NODES.svg
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('preserveAspectRatio', 'none')

  // Resize wrapper & axis
  NODES.wrapper.attr('transform', `translate(${MARGINS.left},${MARGINS.top})`)

  // Resize axis
  if (!hideAxis) {
    NODES.axisBot.attr('transform', `translate(0,${HEIGHT + 10})`)
  }

  if (INVALIDATED.color) {
    if (isInteractive) {
      // Update focus bar colors
      NODES.xBar.attr('stroke', COLORS.focusBar)
      // Update dot color
      NODES.focus.attr('stroke', COLORS.focus)
    }
    // Update gradient color
    NODES.wrapper.selectAll('path').style('transition', transition)
    NODES.gradientStart.attr('stop-color', COLORS.gradientStart)
    NODES.gradientStop.attr('stop-color', COLORS.gradientStop)

    // Update line color
    NODES.line.attr('stroke', COLORS.line)
  }

  // Hide interactive things
  if (isInteractive) {
    NODES.focus.style('opacity', 0)
    NODES.tooltip.style('opacity', 0)
    NODES.xBar.style('opacity', 0)
  }

  // Draw axis
  if (!hideAxis) {
    NODES.axisLeft.call(
      d3
        .axisLeft(y)
        .tickSize(0)
        .ticks(3)
        .tickFormat(renderTickY),
    )
    NODES.axisBot.call(
      d3
        .axisBottom(x)
        .ticks(nbTicksX)
        .tickSize(0)
        .tickPadding(nearZero ? 0 : 10)
        .tickFormat(val => (renderTickX ? renderTickX(val) : val)),
    )
    stylizeAxis(theme, NODES.axisLeft)
    stylizeAxis(theme, NODES.axisBot, !nearZero)
  }

  // Draw ticks
  if (!hideAxis) {
    const yTicks = d3
      .axisLeft(y)
      .ticks(3)
      .tickSize(-WIDTH)
      .tickFormat('')

    NODES.yTicks.call(yTicks)
    NODES.yTicks.select('.domain').remove()

    NODES.yTicks
      .selectAll('.tick line')
      .attr('stroke', theme.colors.palette.divider)
      .attr('stroke-dasharray', '5, 5')

    if (nearZero) {
      NODES.yTicks
        .selectAll('.tick:first-of-type line')
        .attr('stroke-width', '1px')
        .attr('stroke-dasharray', 'none')
    }
  }

  // Draw line and gradient
  NODES.fillArea.data([DATA]).attr('d', area)
  NODES.line.data([DATA]).attr('d', valueline)
}

function stylizeAxis(theme, axis, showAxisLine) {
  axis.selectAll('.tick line').attr('stroke', 'none')
  axis.selectAll('path').attr('stroke', showAxisLine ? theme.colors.palette.divider : 'none')
  axis
    .selectAll('text')
    .attr('fill', theme.colors.palette.text.shade60)
    .style('font-size', '12px')
    .style('font-family', 'Inter')
}
