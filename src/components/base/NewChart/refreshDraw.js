// @flow

import * as d3 from 'd3'
import moment from 'moment'
import { formatShort } from '@ledgerhq/currencies'

import { colors as themeColors } from 'styles/theme'

import type { Props } from '.'
import type { CTX } from './types'

const TICK_X_SCALE = {
  week: 7,
  month: 10,
  year: 13,
  default: 10,
}

function getTickXCount(tickXScale) {
  return TICK_X_SCALE[tickXScale] || TICK_X_SCALE.default
}

const RENDER_TICK_X = {
  year: 'MMM.',
  default: 'MMM. D',
}

function getRenderTickX(selectedTime) {
  return t => moment(t).format(RENDER_TICK_X[selectedTime] || RENDER_TICK_X.default)
}

export default function refreshDraw({ ctx, props }: { ctx: CTX, props: Props }) {
  const { NODES, WIDTH, HEIGHT, MARGINS, COLORS, INVALIDATED, DATA, x, y } = ctx
  const { hideAxis, interactive, tickXScale, unit } = props

  const nbTicksX = getTickXCount(tickXScale)
  const renderTickX = getRenderTickX(tickXScale)
  const renderTickY = t => formatShort(unit, t)

  const area = d3
    .area()
    .x(d => x(d.parsedDate))
    .y0(HEIGHT)
    .y1(d => y(d.value))

  const valueline = d3
    .line()
    .x(d => x(d.parsedDate))
    .y(d => y(d.value))

  // Resize container
  NODES.svg
    .attr('width', WIDTH + MARGINS.left + MARGINS.right)
    .attr('height', HEIGHT + MARGINS.top + MARGINS.bottom)

  // Resize wrapper & axis
  NODES.wrapper.attr('transform', `translate(${MARGINS.left},${MARGINS.top})`)

  // Resize axis
  if (!hideAxis) {
    NODES.axisBot.attr('transform', `translate(0,${HEIGHT + 10})`)
  }

  if (INVALIDATED.color) {
    if (interactive) {
      // Update focus bar colors
      NODES.xBar.attr('stroke', COLORS.focusBar)
      NODES.yBar.attr('stroke', COLORS.focusBar)
      // Update dot color
      NODES.focus.attr('fill', COLORS.focus)
    }
    // Update gradient color
    NODES.gradientStart.attr('stop-color', COLORS.gradientStart)
    NODES.gradientStop.attr('stop-color', COLORS.gradientStop)

    // Update line color
    NODES.line.attr('stroke', COLORS.line)
  }

  // Hide interactive things
  if (interactive) {
    NODES.focus.style('opacity', 0)
    NODES.tooltip.style('opacity', 0)
    NODES.xBar.style('opacity', 0)
    NODES.yBar.style('opacity', 0)
  }

  // Draw axis
  if (!hideAxis) {
    NODES.axisLeft.call(
      d3
        .axisLeft(y)
        .ticks(3)
        .tickFormat(val => (renderTickY ? renderTickY(val) : val)),
    )
    NODES.axisBot.call(
      d3
        .axisBottom(x)
        .ticks(nbTicksX)
        .tickFormat(val => (renderTickX ? renderTickX(val) : val)),
    )
    stylizeAxis(NODES.axisLeft)
    stylizeAxis(NODES.axisBot)
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
      .attr('stroke', 'rgba(0, 0, 0, 0.1)')
      .attr('stroke-dasharray', '5, 5')

    NODES.yTicks
      .selectAll('.tick:first-of-type line')
      .attr('stroke-width', '2px')
      .attr('stroke-dasharray', 'none')
  }

  // Draw line and gradient
  NODES.fillArea.data([DATA]).attr('d', area)
  NODES.line.data([DATA]).attr('d', valueline)
}

function stylizeAxis(axis) {
  axis.selectAll('.tick line').attr('stroke', 'none')
  axis.selectAll('path').attr('stroke', 'none')
  axis
    .selectAll('text')
    .attr('stroke', themeColors.grey)
    .style('font-size', '12px')
    .style('font-family', 'Open Sans')
    .style('font-weight', 300)
}
