// @flow

import React from 'react'
import styled from 'styled-components'

import Box, { Tabbable } from 'components/base/Box'
import Text from 'components/base/Text'

const Container = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  m: 2,
})`
  width: 150px;
  height: 150px;
  background: white;
`

// https://api.ledgerwallet.com/update/assets/icons/bitcoin

const ActionBtn = styled(Tabbable).attrs({
  fontSize: 3,
})``

const AppIcon = styled.img`
  display: block;
  width: 50px;
  height: 50px;
`

type Props = {
  name: string,
  icon: string,
  onInstall: Function,
  onUninstall: Function,
}

export default function ManagerApp(props: Props) {
  const { name, icon, onInstall, onUninstall } = props
  const iconUrl = `https://api.ledgerwallet.com/update/assets/icons/${icon}`
  return (
    <Container flow={3}>
      <AppIcon src={iconUrl} />

      <Text ff="Museo Sans|Bold">{name}</Text>
      <Box horizontal flow={2}>
        <ActionBtn onClick={onInstall}>{'Install'}</ActionBtn>
        <ActionBtn onClick={onUninstall}>{'Remove'}</ActionBtn>
      </Box>
    </Container>
  )
}
