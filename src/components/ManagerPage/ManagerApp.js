// @flow

import React from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Trash from 'icons/Trash'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'

export const Container = styled(Box).attrs(() => ({
  horizontal: true,
  p: 4,
  bg: 'palette.background.paper',
  boxShadow: p => (p.noShadow ? -1 : 0),
  borderRadius: 4,
  flow: 2,
}))`
  line-height: normal;
`

const AppIcon = styled.img`
  display: block;
  width: 36px;
  height: 36px;
  pointer-events: none;
`

const AppName = styled(Box).attrs(() => ({
  ff: 'Inter|Regular',
  fontSize: 4,
  color: 'palette.text.shade100',
}))`
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
  onInstall?: Function,
  onUninstall: Function,
}

function ManagerApp({ name, version, icon, onInstall, onUninstall, t }: Props) {
  const iconUrl = `https://api.ledgerwallet.com/update/assets/icons/${icon}`
  return (
    <Container>
      <AppIcon src={iconUrl} />
      <Box flex="1" ml={3}>
        <AppName flex={1}>{name}</AppName>
        <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade60">
          {version}
        </Text>
      </Box>
      {onInstall ? (
        <Button
          outline
          onClick={onInstall}
          event={'Manager Install Click'}
          eventProperties={{
            appName: name,
            appVersion: version,
          }}
        >
          {t('manager.apps.install')}
        </Button>
      ) : null}
      <Button
        outline
        onClick={onUninstall}
        event={'Manager Uninstall Click'}
        eventProperties={{
          appName: name,
          appVersion: version,
        }}
        outlineColor="palette.text.shade60"
      >
        <Trash size={16} fill="palette.text.shade60" />
      </Button>
    </Container>
  )
}

export default translate()(ManagerApp)
