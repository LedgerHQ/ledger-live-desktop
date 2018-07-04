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
import FakeLink from '../base/FakeLink'

import AppsList from './AppsList'
import FirmwareUpdate from './FirmwareUpdate'

type Props = {
  t: T,
  device: Device,
  deviceInfo: DeviceInfo,
  handleHelpRequest: () => void,
}

const Dashboard = ({ device, deviceInfo, t, handleHelpRequest }: Props) => (
  <Box flow={4} pb={8}>
    <TrackPage category="Manager" name="Dashboard" />
    <Box>
      <Text ff="Museo Sans|Regular" fontSize={7} color="dark">
        {t('app:manager.title')}
      </Text>
      <Box horizontal>
        <Text ff="Museo Sans|Light" fontSize={5}>
          {t('app:manager.subtitle')}
        </Text>
        <ContainerToHover>
          <FakeLink
            mr={1}
            underline
            color="grey"
            ff="Museo Sans|Light"
            fontSize={4}
            onClick={handleHelpRequest}
          >
            {t('app:common.needHelp')}
          </FakeLink>
          <IconExternalLink size={14} />
        </ContainerToHover>
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

const ContainerToHover = styled(Box).attrs({
  align: 'center',
  ml: 'auto',
  horizontal: true,
})`
  ${FakeLink}:hover, &:hover {
    color: ${p => p.theme.colors.wallet};
  }
`
