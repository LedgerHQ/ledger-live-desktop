// @flow
import React from 'react'
import { translate } from 'react-i18next'

import type { T, Device } from 'types/common'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

import AppsList from './AppsList'
import FirmwareUpdate from './FirmwareUpdate'

type DeviceInfo = {
  targetId: number | string,
  version: string,
  final: boolean,
  mcu: boolean,
}

type Props = {
  t: T,
  device: Device,
  deviceInfo: DeviceInfo,
}

const Dashboard = ({ device, deviceInfo, t }: Props) => (
  <Box flow={4}>
    <Box>
      <Text ff="Museo Sans|Regular" fontSize={7} color="black">
        {t('manager:title')}
      </Text>
      <Text ff="Museo Sans|Light" fontSize={5}>
        {t('manager:subtitle')}
      </Text>
    </Box>
    <Box mt={7}>
      <FirmwareUpdate
        infos={{
          targetId: deviceInfo.targetId,
          version: deviceInfo.version,
        }}
        device={device}
      />
    </Box>
    <Box>
      <AppsList device={device} targetId={deviceInfo.targetId} />
    </Box>
  </Box>
)

export default translate()(Dashboard)
