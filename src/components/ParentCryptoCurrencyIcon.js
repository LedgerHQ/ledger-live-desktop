// @flow
import React, { PureComponent } from 'react'
import styled, { withTheme } from 'styled-components'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import Tooltip from 'components/base/Tooltip'
import Text from 'components/base/Text'
import { Trans } from 'react-i18next'
import CryptoCurrencyIcon from './CryptoCurrencyIcon'
import { rgba } from '../styles/helpers'

type Props = {
  currency: Currency,
  withTooltip?: boolean,
  bigger?: boolean,
  inactive?: boolean,
}

const ParentCryptoCurrencyIconWrapper = styled.div`
  ${p =>
    p.doubleIcon
      ? `
  > :nth-child(1) {
    clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 81% 50%, 68% 54%, 58% 63%, 52% 74%, 50% 86%, 50% 100%, 0% 100%);
  }`
      : `
  display: flex;
  align-items: center;`}

  line-height: ${p => (p.bigger ? '18px' : '18px')};
  font-size: ${p => (p.bigger ? '12px' : '12px')};
  > :nth-child(2) {
    margin-top: ${p => (p.bigger ? '-15px' : '-13px')};
    margin-left: ${p => (p.bigger ? '10px' : '8px')};
    border: 2px solid transparent;
  }
`
const TooltipWrapper = styled.div`
  display: flex;
  max-width: 150px;
  flex-direction: column;
`

const CryptoCurrencyIconTooltip = withTheme(({ name, theme }: { theme: any, name: string }) => (
  <TooltipWrapper>
    <Text color={rgba(theme.colors.palette.background.paper, 0.5)}>
      <Trans i18nKey={'tokensList.tooltip'} />
    </Text>
    <Text>{name}</Text>
  </TooltipWrapper>
))

class ParentCryptoCurrencyIcon extends PureComponent<Props> {
  render() {
    const { currency, bigger, withTooltip, inactive } = this.props

    const parent = currency.type === 'TokenCurrency' ? currency.parentCurrency : null

    const content = (
      <ParentCryptoCurrencyIconWrapper doubleIcon={!!parent} bigger={bigger}>
        {parent && (
          <CryptoCurrencyIcon inactive={inactive} currency={parent} size={bigger ? 20 : 16} />
        )}
        <CryptoCurrencyIcon inactive={inactive} currency={currency} size={bigger ? 20 : 16} />
      </ParentCryptoCurrencyIconWrapper>
    )

    if (withTooltip && parent) {
      return <Tooltip content={<CryptoCurrencyIconTooltip name={parent.name} />}>{content}</Tooltip>
    }

    return content
  }
}

export default ParentCryptoCurrencyIcon
