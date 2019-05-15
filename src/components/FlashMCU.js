// @flow

import React from 'react'
import styled from 'styled-components'
import { translate, Trans } from 'react-i18next'
import type { DeviceModelId } from '@ledgerhq/devices'

import Interactions from 'icons/device/interactions'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import { bootloader } from 'config/nontranslatables'

const Bullet = styled.span`
  font-weight: 600;
  color: #142533;
`

const Separator = styled(Box).attrs({
  color: 'fog',
})`
  height: 1px;
  width: 100%;
  background-color: currentColor;
`

type Props = {
  deviceModelId: DeviceModelId,
}

const FlashMCU = React.memo(({ t, deviceModelId }: Props) => (
  <>
    <Box mx={7}>
      <Text ff="Open Sans|Regular" align="center" color="smoke">
        <Bullet>{'1. '}</Bullet>
        {t('manager.modal.mcuFirst')}
      </Text>
      <Box mt={5}>
        <Interactions wire="disconnecting" type={deviceModelId} width={368} />
      </Box>
    </Box>
    <Separator my={6} />
    <Box mx={7}>
      <Text ff="Open Sans|Regular" align="center" color="smoke">
        <Bullet>{'2. '}</Bullet>
        <Trans i18nKey="manager.modal.mcuSecond">
          {'Press the left button and hold it while you reconnect the USB cable until the '}
          <Text ff="Open Sans|SemiBold" color="dark">
            {bootloader}
          </Text>
          {' screen appears'}
        </Trans>
      </Text>
      <Box mt={5}>
        <Interactions action="left" wire="connecting" type={deviceModelId} width={368} />
      </Box>
    </Box>
  </>
))

export default translate()(FlashMCU)
