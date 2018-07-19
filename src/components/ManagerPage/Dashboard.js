// @flow
import React from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import type { T, Device } from 'types/common'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import IconExternalLink from 'icons/ExternalLink'
import TrackPage from 'analytics/TrackPage'
import FakeLink from 'components/base/FakeLink'

import AppsList from './AppsList'
import FirmwareUpdate from './FirmwareUpdate'

type Props = {
  t: T,
  device: Device,
  deviceInfo: DeviceInfo,
  handleHelpRequest: () => void,
}

const Dashboard = ({ device, deviceInfo, t, handleHelpRequest }: Props) => (
  <Box flow={4} pb={8} selectable>
    <TrackPage category="Manager" name="Dashboard" />
    <Box>
      <Text ff="Museo Sans|Regular" fontSize={7} color="dark">
        {t('app:manager.title')}
      </Text>
      <Box horizontal>
        <Text ff="Museo Sans|Light" fontSize={5}>
          {t('app:manager.subtitle')}
        </Text>
        <HelpLink onClick={handleHelpRequest}>
          <div style={{ textDecoration: 'underline' }}>{t('app:common.needHelp')}</div>
          <IconExternalLink size={14} />
        </HelpLink>
      </Box>
    </Box>
    <Box mt={5}>
      <FirmwareUpdate deviceInfo={deviceInfo} device={device} />
    </Box>
    <Box mt={5}>
      {deviceInfo.isOSU || deviceInfo.isBootloader ? null : (
        <AppsList device={device} deviceInfo={deviceInfo} />
      )}
    </Box>
  </Box>
)

export default translate()(Dashboard)

const HelpLink = styled(FakeLink).attrs({
  align: 'center',
  ml: 'auto',
  horizontal: true,
  flow: 1,
  color: 'grey',
  fontSize: 4,
})`
  &:hover {
    color: ${p => p.theme.colors.wallet};
  }
`
