// @flow
import React from 'react'
import { translate } from 'react-i18next'

import type { T, Device } from 'types/common'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import TrackPage from 'analytics/TrackPage'

import AppsList from './AppsList'
import FirmwareUpdate from './FirmwareUpdate'

type Props = {
  t: T,
  device: Device,
  deviceInfo: DeviceInfo,
}

const Dashboard = ({ device, deviceInfo, t }: Props) => (
  <Box flow={4} pb={8}>
    <TrackPage category="Manager" name="Dashboard" />
    <Box>
      <Text ff="Museo Sans|Regular" fontSize={7} color="black">
        {t('app:manager.title')}
      </Text>
      <Text ff="Museo Sans|Light" fontSize={5}>
        {t('app:manager.subtitle')}
      </Text>
    </Box>
    <Box mt={5}>
      <FirmwareUpdate deviceInfo={deviceInfo} device={device} />
    </Box>
    <Box mt={5}>
      <AppsList device={device} deviceInfo={deviceInfo} />
    </Box>
  </Box>
)

export default translate()(Dashboard)
