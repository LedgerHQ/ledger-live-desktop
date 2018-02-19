// @flow

import React from 'react'
import styled from 'styled-components'

import { formatCurrencyUnit } from '@ledgerhq/currencies'
import type { Unit } from '@ledgerhq/currencies'

import Text from 'components/base/Text'

const T = styled(Text).attrs({
  ff: 'Rubik',
  color: p => (p.isNegative ? p.theme.colors.grenade : p.theme.colors.green),
})``

type Props = {
  val: number,
  isPercent?: boolean,
  unit?: Unit | null,
  alwaysShowSign?: boolean,
  showCode?: boolean,
}

function FormattedVal(props: Props) {
  const { val, isPercent, unit, alwaysShowSign, showCode, ...p } = props

  const isNegative = val < 0

  let text = ''

  if (isPercent) {
    text = `${alwaysShowSign ? (isNegative ? '- ' : '+ ') : ''}${val} %`
  } else {
    if (!unit) {
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
}

export default FormattedVal
