// @flow

import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import isUndefined from 'lodash/isUndefined'

import type { Unit } from '@ledgerhq/live-common/lib/types'
import type { State } from 'reducers'

import {
  formatCurrencyUnit,
  findCurrencyByTicker,
} from '@ledgerhq/live-common/lib/helpers/currencies'

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
  alwaysShowSign?: boolean,
  animateTicker?: boolean,
  color?: string,
  disableRounding?: boolean,
  fiat?: string,
  isPercent?: boolean,
  showCode?: boolean,
  unit?: Unit,
  val: number,
  withIcon?: boolean,
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
    fiat,
    isPercent,
    alwaysShowSign,
    showCode,
    withIcon,
    locale,
    marketIndicator,
    color,
    ...p
  } = props
  let { val, unit } = props

  if (isUndefined(val)) {
    throw new Error('FormattedVal require a `val` prop. Received `undefined`')
  }

  const isNegative = val < 0

  let text = ''

  if (isPercent) {
    text = `${alwaysShowSign ? (isNegative ? '- ' : '+ ') : ''}${isNegative ? val * -1 : val} %`
  } else {
    if (fiat) {
      console.warn('FormattedVal: passing fiat prop is deprecated')
      const cur = findCurrencyByTicker(fiat)
      if (cur) {
        ;[unit] = cur.units
      }
    }
    if (!unit) {
      return ''
    }

    if (withIcon && isNegative) {
      val *= -1
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
