// @flow

import React from 'react'
import styled from 'styled-components'
import { getIconByCoinType } from '@ledgerhq/currencies/react'

import type { Currency } from '@ledgerhq/currencies'

import Box, { Tabbable } from 'components/base/Box'
import Text from 'components/base/Text'

const Container = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  m: 1,
})`
  width: 150px;
  height: 150px;
  background: rgba(0, 0, 0, 0.05);
`

const ActionBtn = styled(Tabbable).attrs({
  fontSize: 3,
})``

type Props = {
  currency: Currency,
  onInstall: Function,
  onUninstall: Function,
}

export default function ManagerApp(props: Props) {
  const { currency, onInstall, onUninstall } = props
  const Icon = getIconByCoinType(currency.coinType)
  return (
    <Container flow={3}>
      {Icon && <Icon size={24} />}
      <Text>{currency.name}</Text>
      <Box horizontal flow={2}>
        <ActionBtn onClick={onInstall}>{'Install'}</ActionBtn>
        <ActionBtn onClick={onUninstall}>{'Remove'}</ActionBtn>
      </Box>
    </Container>
  )
}
