// @flow

import React from 'react'

import { colors as themeColors } from 'styles/theme'
import { TooltipContainer } from 'components/base/Tooltip'

import type { Item } from './types'

/**
 * styled-components is not run on those components, because tooltip is
 * rendered as a string on d3 updates
 *
 * so, we use inline style.
 */

const Arrow = () => (
  <svg
    style={{
      display: 'block',
      position: 'absolute',
      left: '50%',
      bottom: 0,
      marginBottom: -10,
      transform: 'translate(-50%, 0)',
    }}
    viewBox="0 0 14 6.2"
    width={16}
    height={16}
  >
    <path fill={themeColors.dark} d="m14 0-5.5 5.6c-0.8 0.8-2 0.8-2.8 0l-5.7-5.6" />
  </svg>
)

export default ({ d }: { d: Item }) => (
  <div style={{ position: 'relative' }}>
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        transform: `translate3d(-50%, 0, 0)`,
        whiteSpace: 'nowrap',
        marginBottom: 10,
      }}
    >
      <TooltipContainer style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14 }}>
          <b>{Math.round(d.value)}</b>
        </div>
        {d.date}
      </TooltipContainer>
      <div style={{ background: 'red' }}>
        <Arrow />
      </div>
    </div>
  </div>
)
