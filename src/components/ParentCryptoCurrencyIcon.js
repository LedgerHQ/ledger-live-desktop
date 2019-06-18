// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import CryptoCurrencyIcon from './CryptoCurrencyIcon'

type Props = {
  currency: Currency,
  borderColor?: string,
}

const ParentCryptoCurrencyIconWrapper = styled.div`
  > :nth-child(2) {
    margin-top: -13px;
    margin-left: 8px;
    border: 2px solid ${p => get(p.theme.colors, p.borderColor || 'white')};
  }
`

class ParentCryptoCurrencyIcon extends PureComponent<Props> {
  render() {
    const { currency, borderColor } = this.props

    if (currency.type === 'TokenCurrency' && currency.parentCurrency) {
      return (
        <ParentCryptoCurrencyIconWrapper borderColor={borderColor}>
          <CryptoCurrencyIcon currency={currency.parentCurrency} size={16} />
          <CryptoCurrencyIcon currency={currency} size={16} />
        </ParentCryptoCurrencyIconWrapper>
      )
    }

    return <CryptoCurrencyIcon currency={currency} size={20} />
  }
}

export default ParentCryptoCurrencyIcon
