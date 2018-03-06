// @flow

import React from 'react'
import styled from 'styled-components'

import type { Unit } from '@ledgerhq/currencies'

import { formatCurrencyUnit, getFiatUnit } from '@ledgerhq/currencies'

import Text from 'components/base/Text'

const T = styled(Text).attrs({
  ff: 'Rubik',
  color: p => (p.isNegative ? p.theme.colors.alertRed : p.theme.colors.positiveGreen),
})``

type Props = {
  val: number,
  fiat?: string | null,
  isPercent?: boolean,
  unit?: Unit | null,
  alwaysShowSign?: boolean,
  showCode?: boolean,
}

function FormattedVal(props: Props) {
  const { fiat, isPercent, alwaysShowSign, showCode, ...p } = props
  let { val, unit } = props

  const isNegative = val < 0

  let text = ''

  if (isPercent) {
    text = `${alwaysShowSign ? (isNegative ? '- ' : '+ ') : ''}${isNegative ? val * -1 : val} %`
  } else {
    if (fiat) {
      unit = getFiatUnit(fiat)
      val *= 10 ** unit.magnitude
    } else if (!unit) {
      return ''
    }
    text = formatCurrencyUnit(unit, val, {
      alwaysShowSign,
      showCode,
    })
  }

  return (
    <T isNegative={isNegative} {...p}>
      {text}
    </T>
  )
}

FormattedVal.defaultProps = {
  unit: null,
  isPercent: false,
  alwaysShowSign: false,
  showCode: false,
  fiat: null,
}

export default FormattedVal
