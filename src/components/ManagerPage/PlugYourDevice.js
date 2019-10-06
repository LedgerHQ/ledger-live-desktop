// @flow
/* eslint-disable react/jsx-no-literals */ // FIXME

import React from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'

// TODO: NOT IN USE, REMOVE

type Props = {
  t: T,
}

function PlugYourDevice(props: Props) {
  const { t } = props
  return (
    <Card py={8} align="center">
      <Box align="center" style={{ width: 365 }}>
        <Box mb={5}>hey</Box>
        <Box
          textAlign="center"
          mb={1}
          ff="Inter|Regular"
          color="palette.text.shade100"
          fontSize={6}
        >
          {t('manager.device.title')}
        </Box>
        <Box textAlign="center" mb={5} ff="Inter|Regular" color="palette.text.shade80" fontSize={4}>
          {t('manager.device.desc')}
        </Box>
        <Button primary>{t('manager.device.cta')}</Button>
      </Box>
    </Card>
  )
}

export default translate()(PlugYourDevice)
