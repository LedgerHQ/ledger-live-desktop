// @flow

import React from 'react'
import styled from 'styled-components'

import type { Unit } from '@ledgerhq/currencies'
import type { T } from 'types/common'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import FormattedVal from 'components/base/FormattedVal'

const Sub = styled(Text).attrs({
  ff: 'Open Sans',
  color: 'warnGrey',
  fontSize: 4,
})`
  text-transform: lowercase;
`

type BalanceSinceProps = {
  since: string,
  totalBalance: number,
  sinceBalance: number,
  refBalance: number,
  t: T,
}

type BalanceTotalProps = {
  children?: any,
  counterValue?: string,
  totalBalance: number,
  unit?: Unit,
}

type Props = {
  counterValue: string,
} & BalanceSinceProps

export function BalanceSincePercent(props: BalanceSinceProps) {
  const { t, totalBalance, sinceBalance, refBalance, since, ...otherProps } = props
  return (
    <Box {...otherProps}>
      <FormattedVal
        isPercent
        val={refBalance ? Math.floor((totalBalance - refBalance) / refBalance * 100) : 0}
        alwaysShowSign
        fontSize={7}
      />
      <Sub>{t(`time:since.${since}`)}</Sub>
    </Box>
  )
}

export function BalanceSinceDiff(props: Props) {
  const { t, totalBalance, sinceBalance, since, counterValue, ...otherProps } = props
  return (
    <Box {...otherProps}>
      <FormattedVal
        fiat={counterValue}
        alwaysShowSign
        showCode
        val={totalBalance - sinceBalance}
        fontSize={7}
      />
      <Sub>{t(`time:since.${since}`)}</Sub>
    </Box>
  )
}

export function BalanceTotal(props: BalanceTotalProps) {
  const { counterValue, totalBalance, children, unit } = props
  return (
    <Box grow>
      <FormattedVal
        alwaysShowSign={false}
        color="dark"
        fiat={counterValue}
        fontSize={8}
        showCode
        style={{ lineHeight: 1 }}
        unit={unit}
        val={totalBalance}
      />
      {children}
    </Box>
  )
}

BalanceTotal.defaultProps = {
  counterValue: undefined,
  children: null,
  unit: undefined,
}

function BalanceInfos(props: Props) {
  const { t, totalBalance, since, sinceBalance, refBalance, counterValue } = props
  return (
    <Box horizontal alignItems="flex-end" flow={7}>
      <BalanceTotal counterValue={counterValue} totalBalance={totalBalance}>
        <Sub>{t('dashboard:totalBalance')}</Sub>
      </BalanceTotal>
      <BalanceSincePercent
        alignItems="flex-end"
        totalBalance={totalBalance}
        sinceBalance={sinceBalance}
        refBalance={refBalance}
        since={since}
        t={t}
      />
      <BalanceSinceDiff
        counterValue={counterValue}
        alignItems="flex-end"
        totalBalance={totalBalance}
        sinceBalance={sinceBalance}
        refBalance={refBalance}
        since={since}
        t={t}
      />
    </Box>
  )
}

export default BalanceInfos
