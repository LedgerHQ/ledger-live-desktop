// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'

const Container = styled(Box).attrs({
  align: 'center',
  m: 3,
  p: 4,
  boxShadow: 0,
  flow: 3,
})`
  width: 156px;
  height: 186px;
  background: white;
  line-height: normal;
`

const AppIcon = styled.img`
  display: block;
  width: 50px;
  height: 50px;
`

const AppName = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 4,
  color: 'dark',
})`
  display: block;
  width: 115px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

type Props = {
  name: string,
  version: string,
  icon: string,
  onInstall: Function,
  // onUninstall: Function,
}

export default function ManagerApp(props: Props) {
  const { name, version, icon, onInstall } = props
  const iconUrl = `https://api.ledgerwallet.com/update/assets/icons/${icon}`
  return (
    <Container>
      <AppIcon src={iconUrl} />
      <Box align="center">
        <AppName>{name}</AppName>
        <Text ff="Open Sans|Regular" fontSize={3} color="grey">
          {version}
        </Text>
      </Box>
      <Button outline onClick={onInstall}>
        {'Install'}
      </Button>
    </Container>
  )
}
