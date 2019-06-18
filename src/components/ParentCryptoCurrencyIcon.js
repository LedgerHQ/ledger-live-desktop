// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import get from "lodash/get"
import type { Currency } from '@ledgerhq/live-common/lib/types'
import CryptoCurrencyIcon from "./CryptoCurrencyIcon"

type Props = {
  currency: Currency,
  parentCurrency?: Currency,
  borderColor?: string
}

const ParentCryptoCurrencyIconWrapper = styled.div`
  > :nth-child(2) {
    margin-top: -13px;
    margin-left: 8px;
    border: 2px solid ${p => get(p.theme.colors, p.borderColor || "white")};
  }
`

class ParentCryptoCurrencyIcon extends PureComponent<Props> {
  render() {
    const { currency, parentCurrency, borderColor } = this.props
    const double = !!parentCurrency

    return (
      <ParentCryptoCurrencyIconWrapper borderColor={borderColor}>
        {parentCurrency && <CryptoCurrencyIcon currency={parentCurrency} size={double ? 16 : 20} />}
        <CryptoCurrencyIcon currency={currency} size={double ? 16 : 20} />
      </ParentCryptoCurrencyIconWrapper>
    )
  }
}

export default ParentCryptoCurrencyIcon
