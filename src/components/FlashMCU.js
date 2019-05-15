// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'
import { translate, Trans } from 'react-i18next'
import { i } from 'helpers/staticPath'
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

const FlashMCU = React.memo(({ t }) => (
  <Fragment>
    <Box mx={7}>
      <Text ff="Open Sans|Regular" align="center" color="smoke">
        <Bullet>{'1. '}</Bullet>
        {t('manager.modal.mcuFirst')}
      </Text>
      <img
        src={i('logos/unplugDevice.png')}
        style={{ width: '100%', maxWidth: 368, marginTop: 30 }}
        alt={t('manager.modal.mcuFirst')}
      />
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
      <img
        src={i('logos/bootloaderMode.png')}
        style={{ width: '100%', maxWidth: 368, marginTop: 30 }}
        alt={t('manager.modal.mcuFirst')}
      />
    </Box>
  </Fragment>
))

export default translate()(FlashMCU)
