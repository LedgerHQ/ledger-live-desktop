// @flow

import React from 'react'
import type { BigNumber } from 'bignumber.js'
import styled from 'styled-components'

import type { Unit, Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import DeltaChange from '../DeltaChange'
import { PlaceholderLine } from '../Placeholder'

const Sub = styled(Box).attrs({
  ff: 'Open Sans',
  fontSize: 4,
})`
  text-transform: lowercase;
`

type BalanceSinceProps = {
  since: string,
  totalBalance: BigNumber,
  sinceBalance: BigNumber,
  refBalance: BigNumber,
  isAvailable: boolean,
  t: T,
}

type BalanceTotalProps = {
  children?: any,
  unit: Unit,
  isAvailable: boolean,
  totalBalance: BigNumber,
  showCryptoEvenIfNotAvailable?: boolean,
}

type Props = {
  counterValue: Currency,
} & BalanceSinceProps

export function BalanceSincePercent(props: BalanceSinceProps) {
  const { t, totalBalance, sinceBalance, refBalance, since, isAvailable, ...otherProps } = props
  return (
    <Box {...otherProps}>
      {!isAvailable ? (
        <PlaceholderLine width={100} />
      ) : (
        <DeltaChange
          from={refBalance}
          to={totalBalance}
          color="dark"
          animateTicker
          fontSize={7}
          withIcon
        />
      )}
      {!isAvailable ? <PlaceholderLine dark width={60} /> : <Sub>{t(`time.since.${since}`)}</Sub>}
    </Box>
  )
}

export function BalanceSinceDiff(props: Props) {
  const { t, totalBalance, sinceBalance, since, counterValue, isAvailable, ...otherProps } = props
  return (
    <Box {...otherProps}>
      {!isAvailable ? (
        <PlaceholderLine width={100} />
      ) : (
        <FormattedVal
          color="dark"
          animateTicker
          unit={counterValue.units[0]}
          fontSize={7}
          showCode
          val={totalBalance.minus(sinceBalance)}
          withIcon
        />
      )}
      {!isAvailable ? <PlaceholderLine dark width={60} /> : <Sub>{t(`time.since.${since}`)}</Sub>}
    </Box>
  )
}

export function BalanceTotal(props: BalanceTotalProps) {
  const { unit, totalBalance, isAvailable, showCryptoEvenIfNotAvailable, children } = props
  return (
    <Box grow {...props}>
      {!isAvailable && !showCryptoEvenIfNotAvailable ? (
        <PlaceholderLine width={150} />
      ) : (
        <FormattedVal
          animateTicker
          color="dark"
          unit={unit}
          fontSize={8}
          disableRounding
          showCode
          val={totalBalance}
        />
      )}
      {!isAvailable ? <PlaceholderLine dark width={50} /> : children}
    </Box>
  )
}

BalanceTotal.defaultProps = {
  children: null,
  unit: undefined,
}

function BalanceInfos(props: Props) {
  const { t, totalBalance, since, sinceBalance, refBalance, isAvailable, counterValue } = props
  return (
    <Box horizontal alignItems="center" flow={7}>
      <BalanceTotal
        unit={counterValue.units[0]}
        isAvailable={isAvailable}
        totalBalance={totalBalance}
      >
        <Sub>{t('dashboard.totalBalance')}</Sub>
      </BalanceTotal>
      <BalanceSincePercent
        alignItems="flex-end"
        totalBalance={totalBalance}
        sinceBalance={sinceBalance}
        isAvailable={isAvailable}
        refBalance={refBalance}
        since={since}
        t={t}
      />
      <BalanceSinceDiff
        counterValue={counterValue}
        alignItems="flex-end"
        isAvailable={isAvailable}
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
