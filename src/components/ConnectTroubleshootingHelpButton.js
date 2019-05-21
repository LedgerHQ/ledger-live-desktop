// @flow

import React from 'react'
import { Trans } from 'react-i18next'
import { colors } from 'styles/theme'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'
import IconHelp from 'icons/Help'
import Button from 'components/base/Button'
import Box from 'components/base/Box'

// $FlowFixMe no idea
const ConnectTroubleshootingHelpButton = React.memo(() => (
  <Button onClick={() => openURL(urls.troubleshootingUSB)} style={{ margin: '0 10px' }}>
    <Box color={colors.wallet} horizontal align="center">
      <IconHelp size={16} />
      {' '}
      <Trans i18nKey="common.help" />
    </Box>
  </Button>
))

export default ConnectTroubleshootingHelpButton
