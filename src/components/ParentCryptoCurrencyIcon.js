// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import type { Currency, Account } from '@ledgerhq/live-common/lib/types'
import Tooltip from 'components/base/Tooltip'
import Text from 'components/base/Text'
import { Trans } from 'react-i18next'
import { colors } from 'styles/theme'
import CryptoCurrencyIcon from './CryptoCurrencyIcon'
import { rgba } from '../styles/helpers'

type Props = {
  currency: Currency,
  parent?: Account,
  borderColor?: string,
}

const ParentCryptoCurrencyIconWrapper = styled.div`
  > :nth-child(2) {
    margin-top: -13px;
    margin-left: 8px;
    border: 2px solid ${p => get(p.theme.colors, p.borderColor || 'white')};
  }
`
const TooltipWrapper = styled.div`
  display: flex;
  max-width: 150px;
  flex-direction: column;
`

const CryptoCurrencyIconTooltip = ({ name }: { name: string }) => (
  <TooltipWrapper>
    <Text color={rgba(colors.white, 0.5)}>
      <Trans i18nKey={'tokensList.tooltip'} />
    </Text>
    <Text>{name}</Text>
  </TooltipWrapper>
)

class ParentCryptoCurrencyIcon extends PureComponent<Props> {
  render() {
    const { currency, parent, borderColor } = this.props
    const double = parent && parent.currency

    const content = (
      <ParentCryptoCurrencyIconWrapper borderColor={borderColor}>
        {double && parent && (
          <CryptoCurrencyIcon currency={parent.currency} size={double ? 16 : 20} />
        )}
        <CryptoCurrencyIcon currency={currency} size={double ? 16 : 20} />
      </ParentCryptoCurrencyIconWrapper>
    )

    if (double && parent) {
      return (
        <Tooltip render={() => <CryptoCurrencyIconTooltip name={parent.name} />}>{content}</Tooltip>
      )
    }

    return content
  }
}

export default ParentCryptoCurrencyIcon
