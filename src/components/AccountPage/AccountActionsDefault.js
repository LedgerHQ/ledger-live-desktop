// @flow
import React from 'react'
import { Trans } from 'react-i18next'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import Box from 'components/base/Box'
import Button from 'components/base/Button'

export const SendActionDefault = ({ onClick }: { onClick: () => void }) => (
  <Button small primary onClick={onClick}>
    <Box horizontal flow={1} alignItems="center">
      <IconSend size={12} />
      <Box>
        <Trans i18nKey="send.title" />
      </Box>
    </Box>
  </Button>
)

export const ReceiveActionDefault = ({ onClick }: { onClick: () => void }) => (
  <Button small primary onClick={onClick}>
    <Box horizontal flow={1} alignItems="center">
      <IconReceive size={12} />
      <Box>
        <Trans i18nKey="receive.title" />
      </Box>
    </Box>
  </Button>
)
