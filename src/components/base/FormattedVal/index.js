// @flow

import React from 'react'
import styled from 'styled-components'
import isUndefined from 'lodash/isUndefined'

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
  disableRounding?: boolean,
}

function FormattedVal(props: Props) {
  const { disableRounding, fiat, isPercent, alwaysShowSign, showCode, ...p } = props
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
      val *= 10 ** unit.magnitude
    } else if (!unit) {
      return ''
    }
    text = formatCurrencyUnit(unit, val, {
      alwaysShowSign,
      disableRounding,
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
  alwaysShowSign: false,
  disableRounding: false,
  fiat: null,
  isPercent: false,
  showCode: false,
  unit: null,
}

export default FormattedVal
