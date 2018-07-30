// @flow

import type { BigNumber } from 'bignumber.js'
import invariant from 'invariant'
import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import type { Unit } from '@ledgerhq/live-common/lib/types'
import type { State } from 'reducers'

import { formatCurrencyUnit } from '@ledgerhq/live-common/lib/helpers/currencies'

import { marketIndicatorSelector, localeSelector } from 'reducers/settings'

import { getMarketColor } from 'styles/helpers'

import Box from 'components/base/Box'
import FlipTicker from 'components/base/FlipTicker'

import IconBottom from 'icons/Bottom'
import IconTop from 'icons/Top'

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
    })
  }

  if (animateTicker) {
    text = <FlipTicker value={text} />
  }

  const marketColor = getMarketColor({
    marketIndicator,
    isNegative,
  })

  return (
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
}

export default connect(mapStateToProps)(FormattedVal)
