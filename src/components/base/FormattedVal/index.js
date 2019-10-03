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

import IconBottom from 'icons/ArrowDownRight'
import IconTop from 'icons/ArrowUpRight'
import Ellipsis from '../Ellipsis'

const T = styled(Box).attrs(p => ({
  ff: 'Inter|Medium',
  horizontal: true,
  color: p.color,
}))`
  line-height: 1.2;
  white-space: pre;
  text-overflow: ellipsis;
  display: ${p => (p.inline ? 'inline-block' : 'block')};
  flex-shrink: 1;
  width: ${p => (p.inline ? '' : '100%')};
  overflow: hidden;
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
  subMagnitude?: number,
  prefix?: string,
  suffix?: string,
}

const mapStateToProps = (state: State, _props: OwnProps) => ({
  marketIndicator: marketIndicatorSelector(state),
  locale: localeSelector(state),
})

type Props = OwnProps & {
  marketIndicator: string,
  locale: string,
  ellipsis?: boolean,
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
    ellipsis,
    subMagnitude,
    prefix,
    suffix,
    ...p
  } = props
  let { val } = props

  invariant(val, 'FormattedVal require a `val` prop. Received `undefined`')

  const isNegative = val.isNegative() && !val.isZero()

  let text = ''

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
      subMagnitude,
    })
  }

  if (prefix) text = prefix + text
  if (suffix) text += suffix

  if (animateTicker && !DISABLE_TICKER_ANIMATION) {
    text = <FlipTicker value={text} />
  } else if (ellipsis) {
    text = <Ellipsis>{text}</Ellipsis>
  }

  const marketColor = getMarketColor({
    marketIndicator,
    isNegative,
  })

  return (
    <T color={color || marketColor} withIcon={withIcon} {...p}>
      {withIcon ? (
        <Box horizontal alignItems="center">
          <Box mr={1}>
            <I color={marketColor}>
              {isNegative ? <IconBottom size={24} /> : <IconTop size={24} />}
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
}

FormattedVal.defaultProps = {
  subMagnitude: 0,
}

export default connect(mapStateToProps)(FormattedVal)
