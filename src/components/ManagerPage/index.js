// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { Node } from 'react'
import type { T, Device } from 'types/common'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

import AppsList from './AppsList'
import FirmwareUpdate from './FirmwareUpdate'
import Workflow from './Workflow'

type DeviceInfo = {
  targetId: number | string,
  version: string,
  final: boolean,
  mcu: boolean,
}

type Error = {
  message: string,
  stack: string,
}

type Props = {
  t: T,
}

type State = {
  modalOpen: boolean,
}

class ManagerPage extends PureComponent<Props, State> {
  render(): Node {
    const { t } = this.props
    return (
      <Workflow
        renderError={(dashboardError: ?Error, genuineError: ?Error) => {
          if (dashboardError) return <span>Dashboard Error: {dashboardError.message}</span>
          if (genuineError) return <span>Genuine Error: {genuineError.message}</span>
          return <span>Error</span>
        }}
        renderFinalUpdate={(deviceInfo: DeviceInfo) => (
          <p>UPDATE FINAL FIRMARE (TEMPLATE + ACTION WIP) {deviceInfo.final}</p>
        )}
        renderMcuUpdate={(deviceInfo: DeviceInfo) => (
          <p>FLASH MCU (TEMPLATE + ACTION WIP) {deviceInfo.mcu}</p>
        )}
        renderDashboard={(device: Device, deviceInfo: DeviceInfo) => (
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
                t={t}
              />
            </Box>
            <Box>
              <AppsList device={device} targetId={deviceInfo.targetId} />
            </Box>
          </Box>
        )}
      />
    )
  }
}

export default translate()(ManagerPage)
