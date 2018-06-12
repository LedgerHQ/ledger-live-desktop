// @flow

import React from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'

type Props = {
  t: T,
}

function PlugYourDevice(props: Props) {
  const { t } = props
  return (
    <Card py={8} align="center">
      <Box align="center" style={{ width: 365 }}>
        <Box mb={5}>hey</Box>
        <Box textAlign="center" mb={1} ff="Museo Sans|Regular" color="dark" fontSize={6}>
          {t('app:manager.plugYourDevice.title')}
        </Box>
        <Box textAlign="center" mb={5} ff="Open Sans|Regular" color="smoke" fontSize={4}>
          {t('app:manager.plugYourDevice.desc')}
        </Box>
        <Button primary>{t('app:manager.plugYourDevice.cta')}</Button>
      </Box>
    </Card>
  )
}

export default translate()(PlugYourDevice)
