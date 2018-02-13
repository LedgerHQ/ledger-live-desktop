// @flow

import React from 'react'
import styled from 'styled-components'

import { formatCurrencyUnit } from '@ledgerhq/currencies'

import Text from 'components/base/Text'

const T = styled(Text).attrs({
  ff: 'Rubik',
  color: p => (p.isNegative ? p.theme.colors.grenade : p.theme.colors.green),
})``

const currencies = {
  BTC: {
    name: 'bitcoin',
    code: 'BTC',
    symbol: 'b',
    magnitude: 8,
  },
  USD: {
    name: 'dollar',
    code: 'USD',
    symbol: '$',
    magnitude: 0,
  },
}

type Props = {
  val: number,
  isPercent?: boolean,
  currency?: any,
  alwaysShowSign?: boolean,
  showCode?: boolean,
}

function FormattedVal(props: Props) {
  const { val, isPercent, currency, alwaysShowSign, showCode, ...p } = props

  const isNegative = val < 0

  let text = ''

  if (isPercent) {
    text = `${alwaysShowSign ? (isNegative ? '- ' : '+ ') : ''}${val} %`
  } else {
    const curr = currency ? currencies[currency.toUpperCase()] : null
    if (!curr) {
      return `[invalid currency ${currency || '(null)'}]`
    }
    text = formatCurrencyUnit(curr, val, {
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
  currency: null,
  isPercent: false,
  alwaysShowSign: false,
  showCode: false,
}

export default FormattedVal
