// @flow

import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Ticker from 'react-flip-ticker'

import isUndefined from 'lodash/isUndefined'

import type { Settings } from 'types/common'
import type { Unit } from '@ledgerhq/currencies'

import { formatCurrencyUnit, getFiatUnit } from '@ledgerhq/currencies'

import { getMarketColor } from 'styles/helpers'

import Box from 'components/base/Box'

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

const I = ({ color, children }: { color: string, children: any }) => (
  <Box color={color}>{children}</Box>
)

const mapStateToProps = state => ({
  settings: state.settings,
})

type Props = {
  alwaysShowSign?: boolean,
  animateTicker?: boolean,
  color?: string,
  disableRounding?: boolean,
  fiat?: string | null,
  isPercent?: boolean,
  settings: Settings,
  showCode?: boolean,
  unit?: Unit | null,
  val: number,
  withIcon?: boolean,
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
    settings,
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
      unit = getFiatUnit(fiat)
    } else if (!unit) {
      return ''
    }

    if (withIcon && isNegative) {
      val *= -1
    }

    text = formatCurrencyUnit(unit, val, {
      alwaysShowSign,
      disableRounding,
      showCode,
    })
  }

  if (animateTicker) {
    text = <Ticker text={text} />
  }

  const marketColor = getMarketColor({
    marketIndicator: settings.marketIndicator,
    isNegative,
  })

  return (
    <T color={color || marketColor} withIcon={withIcon} {...p}>
      {withIcon ? (
        <Box horizontal alignItems="center" flow={1}>
          <Box>
            {isNegative ? (
              <I color={marketColor}>
                <IconBottom size={16} />
              </I>
            ) : (
              <I color={marketColor}>
                <IconTop size={16} />
              </I>
            )}
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
  alwaysShowSign: false,
  animateTicker: false,
  color: undefined,
  disableRounding: false,
  fiat: null,
  isPercent: false,
  showCode: false,
  unit: null,
  withIcon: false,
}

export default connect(mapStateToProps)(FormattedVal)
