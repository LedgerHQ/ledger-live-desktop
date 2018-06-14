// @flow

import React from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Trash from 'icons/Trash'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'

const Container = styled(Box).attrs({
  horizontal: true,
  my: 2,
  mx: 3,
  p: 4,
  boxShadow: 0,
  borderRadius: 4,
  flow: 2,
})`
  width: calc(50% - 30px);
  background: white;
  line-height: normal;
`

const AppIcon = styled.img`
  display: block;
  width: 36px;
  height: 36px;
`

const AppName = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 4,
  color: 'dark',
})`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

type Props = {
  t: T,
  name: string,
  version: string,
  icon: string,
  onInstall: Function,
  onUninstall: Function,
}

function ManagerApp({ name, version, icon, onInstall, onUninstall, t }: Props) {
  const iconUrl = `https://api.ledgerwallet.com/update/assets/icons/${icon}`
  return (
    <Container>
      <AppIcon src={iconUrl} />
      <Box flex="1" ml={3}>
        <AppName flex={1}>{name}</AppName>
        <Text ff="Open Sans|Regular" fontSize={3} color="grey">
          {version}
        </Text>
      </Box>
      <Button outline onClick={onInstall}>
        {t('app:manager.apps.install')}
      </Button>
      <Button outline onClick={onUninstall} outlineColor="grey">
        <Trash size={16} fill="grey" />
      </Button>
    </Container>
  )
}

export default translate()(ManagerApp)
