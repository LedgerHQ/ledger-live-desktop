// @flow

import React from 'react'
import * as d3 from 'd3'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import createStore from 'renderer/createStore'

import type { CTX } from './types'

import Tooltip from './Tooltip'

export default function handleMouseEvents({
  ctx,
  shouldTooltipUpdate,
  onTooltipUpdate,
  renderTooltip,
  mapValue,
  theme,
}: {
  ctx: CTX,
  shouldTooltipUpdate: Function,
  onTooltipUpdate: Function,
  renderTooltip?: Function,
  mapValue: (*) => number,
  theme: any,
}) {
  const { MARGINS, HEIGHT, WIDTH, NODES, DATA, x, y } = ctx

  const bisectDate = d3.bisector(d => d.parsedDate).left

  const node = NODES.wrapper
    .append('rect')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('class', 'overlay')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)

  node
    .on('mousemove', mouseMove)
    .on('mouseenter', mouseEnter)
    .on('mouseout', mouseOut)

  function getStep() {
    const x0 = x.invert(d3.mouse(this)[0])
    const i = bisectDate(DATA, x0, 1)
    const d0 = DATA[i - 1]
    const d1 = DATA[i]
    if (!d0 || !d1) {
      return null
    }
    return x0 - d0.parsedDate > d1.parsedDate - x0 ? d1 : d0
  }

  function mouseEnter() {
    const d = getStep.call(this)
    if (!d) {
      return
    }
    NODES.tooltip
      .style('transition', '100ms cubic-bezier(.61,1,.53,1) opacity')
      .style('opacity', 1)
      .style('left', `${Math.floor(MARGINS.left + x(d.parsedDate))}px`)
    NODES.focus.style('opacity', 1)
    NODES.xBar.style('opacity', 1)
  }

  function mouseOut() {
    NODES.tooltip.style('opacity', 0).style('transition', '100ms linear opacity')
    NODES.focus.style('opacity', 0)
    NODES.xBar.style('opacity', 0)
  }

  function mouseMove() {
    const d = getStep.call(this)
    if (!d) {
      return
    }
    if (!shouldTooltipUpdate(d)) {
      return
    }
    onTooltipUpdate(d)
    NODES.focus.attr('transform', `translate(${x(d.parsedDate)},${y(mapValue(d))})`)
    renderTooltip &&
      NODES.tooltip
        .html(
          renderToString(
            // FIXME :o why is this not in React tree. maybe use a portal (native in React now)
            <Provider store={createStore({})}>
              <ThemeProvider theme={theme}>
                <Tooltip renderTooltip={renderTooltip} item={d.ref} />
              </ThemeProvider>
            </Provider>,
          ),
        )
        .style('left', `${Math.floor(MARGINS.left + x(d.parsedDate))}px`)
    NODES.xBar
      .attr('x1', x(d.parsedDate))
      .attr('x2', x(d.parsedDate))
      .attr('y1', -30) // ensure that xbar is covered
      .attr('y2', HEIGHT)
  }

  return node
}
