// @flow

import React from 'react'

import type { Unit } from '@ledgerhq/currencies'

import { colors as themeColors } from 'styles/theme'
import { TooltipContainer } from 'components/base/Tooltip'
import FormattedVal from 'components/base/FormattedVal'

import type { Item } from './types'

/**
 * we use inline style for more perfs, as tooltip may re-render numerous times
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

const Tooltip = ({
  d,
  renderTooltip,
  fiat,
  unit,
}: {
  d: Item,
  renderTooltip?: Function,
  fiat?: string,
  unit?: Unit,
}) => (
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
        {renderTooltip ? (
          renderTooltip(d)
        ) : (
          <FormattedVal
            alwaysShowSign={false}
            color="white"
            showCode
            fiat={fiat}
            unit={unit}
            val={d.value}
          />
        )}
      </TooltipContainer>
      <div style={{ background: 'red' }}>
        <Arrow />
      </div>
    </div>
  </div>
)

Tooltip.defaultProps = {
  renderTooltip: undefined,
  fiat: undefined,
  unit: undefined,
}

export default Tooltip
