// @flow

import React from 'react'
import styled from 'styled-components'

import { formatCurrencyUnit, getFiatUnit } from '@ledgerhq/currencies'
import type { Unit } from '@ledgerhq/currencies'

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
  const { val, fiat, isPercent, alwaysShowSign, showCode, ...p } = props
  let { unit } = props

  const isNegative = val < 0

  let text = ''

  if (isPercent) {
    text = `${alwaysShowSign ? (isNegative ? '- ' : '+ ') : ''}${val} %`
  } else {
    if (fiat) {
      unit = getFiatUnit(fiat)
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
