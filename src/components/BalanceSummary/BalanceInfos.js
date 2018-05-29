// @flow

import React from 'react'
import styled from 'styled-components'

import type { Unit, Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import DeltaChange from '../DeltaChange'

const Sub = styled(Box).attrs({
  ff: 'Open Sans',
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
  unit: Unit,
  totalBalance: number,
}

type Props = {
  counterValue: Currency,
} & BalanceSinceProps

export function BalanceSincePercent(props: BalanceSinceProps) {
  const { t, totalBalance, sinceBalance, refBalance, since, ...otherProps } = props
  return (
    <Box {...otherProps}>
      <DeltaChange
        from={refBalance}
        to={totalBalance}
        color="dark"
        animateTicker
        fontSize={7}
        withIcon
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
        color="dark"
        animateTicker
        unit={counterValue.units[0]}
        fontSize={7}
        showCode
        val={totalBalance - sinceBalance}
        withIcon
      />
      <Sub>{t(`time:since.${since}`)}</Sub>
    </Box>
  )
}

export function BalanceTotal(props: BalanceTotalProps) {
  const { unit, totalBalance, children } = props
  return (
    <Box grow {...props}>
      <FormattedVal
        animateTicker
        color="dark"
        unit={unit}
        fontSize={8}
        showCode
        val={totalBalance}
      />
      {children}
    </Box>
  )
}

BalanceTotal.defaultProps = {
  children: null,
  unit: undefined,
}

function BalanceInfos(props: Props) {
  const { t, totalBalance, since, sinceBalance, refBalance, counterValue } = props
  return (
    <Box horizontal alignItems="center" flow={7}>
      <BalanceTotal unit={counterValue.units[0]} totalBalance={totalBalance}>
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
