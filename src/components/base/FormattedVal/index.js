// @flow

import type { BigNumber } from 'bignumber.js'
import invariant from 'invariant'
import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import type { Unit } from '@ledgerhq/live-common/lib/types'
import type { State } from 'reducers'

import { formatCurrencyUnit } from '@ledgerhq/live-common/lib/currencies'

import { DISABLE_TICKER_ANIMATION } from 'config/constants'
import { marketIndicatorSelector, localeSelector } from 'reducers/settings'

import { getMarketColor } from 'styles/helpers'

import Box from 'components/base/Box'
import FlipTicker from 'components/base/FlipTicker'

import IconBottom from 'icons/Bottom'
import IconTop from 'icons/Top'
import Tooltip from 'components/base/Tooltip'

const T = styled(Box).attrs({
  ff: 'Rubik',
  horizontal: true,
  color: p => (p.withIcon ? p.theme.colors.dark : p.color),
})`
  line-height: 1.2;
  white-space: pre;
`

const I = ({ color, children }: { color?: string, children: any }) => (
  <Box color={color}>{children}</Box>
)

I.defaultProps = {
  color: undefined,
}

type OwnProps = {
  unit?: Unit,
  val: BigNumber,
  alwaysShowSign?: boolean,
  showCode?: boolean,
  withIcon?: boolean,
  color?: string,
  animateTicker?: boolean,
  disableRounding?: boolean,
  isPercent?: boolean,
  maxLength?: number,
}

const mapStateToProps = (state: State, _props: OwnProps) => ({
  marketIndicator: marketIndicatorSelector(state),
  locale: localeSelector(state),
})

type Props = OwnProps & {
  marketIndicator: string,
  locale: string,
}

function FormattedVal(props: Props) {
  const {
    animateTicker,
    disableRounding,
    unit,
    isPercent,
    alwaysShowSign,
    showCode,
    withIcon,
    locale,
    marketIndicator,
    color,
    maxLength,
    ...p
  } = props
  let { val } = props

  invariant(val, 'FormattedVal require a `val` prop. Received `undefined`')

  const isNegative = val.isNegative() && !val.isZero()

  let text = ''
  let showTooltip = false

  if (isPercent) {
    // FIXME move out the % feature of this component... totally unrelated to currency & annoying for flow type.
    text = `${alwaysShowSign ? (isNegative ? '- ' : '+ ') : ''}${(isNegative
      ? val.negated()
      : val
    ).toString()} %`
  } else {
    invariant(unit, 'FormattedVal require a `unit` prop. Received `undefined`')

    if (withIcon && isNegative) {
      val = val.negated()
    }

    text = formatCurrencyUnit(unit, val, {
      alwaysShowSign,
      disableRounding,
      showCode,
      locale,
    })

    if (maxLength && text.length > maxLength) {
      text = `${text.substring(0, maxLength)}...`
      showTooltip = true
    }
  }

  if (animateTicker && !DISABLE_TICKER_ANIMATION) {
    text = <FlipTicker value={text} />
  }

  const marketColor = getMarketColor({
    marketIndicator,
    isNegative,
  })

  const content = (
    <T color={color || marketColor} withIcon={withIcon} {...p}>
      {withIcon ? (
        <Box horizontal alignItems="center" flow={1}>
          <Box>
            <I color={marketColor}>
              {isNegative ? <IconBottom size={16} /> : <IconTop size={16} />}
            </I>
          </Box>
          <Box horizontal alignItems="center">
            {text}
          </Box>
        </Box>
      ) : (
        text
      )}
    </T>
  )

  if (showTooltip) {
    return <Tooltip render={() => unit && formatCurrencyUnit(unit, val)}> {content} </Tooltip>
  }
  return content
}

export default connect(mapStateToProps)(FormattedVal)
