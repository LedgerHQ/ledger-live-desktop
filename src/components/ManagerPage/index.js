// @flow
/* eslint-disable react/jsx-no-literals */ // FIXME: remove

import React, { PureComponent } from 'react'

import type { Device } from 'types/common'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import Workflow from 'components/Workflow'
import WorkflowWithIcon from 'components/Workflow/WorkflowWithIcon'
import Dashboard from './Dashboard'
import FlashMcu from './FlashMcu'

type Error = {
  message: string,
  stack: string,
}

class ManagerPage extends PureComponent<*, *> {
  render() {
    return (
      <Workflow
        renderFinalUpdate={(device: Device, deviceInfo: DeviceInfo) => (
          <p>UPDATE FINAL FIRMARE (TEMPLATE + ACTION WIP) {deviceInfo.isOSU}</p>
        )}
        renderMcuUpdate={(device: Device, deviceInfo: DeviceInfo) => (
          <FlashMcu device={device} deviceInfo={deviceInfo} />
        )}
        renderDashboard={(device: Device, deviceInfo: DeviceInfo) => (
          <Dashboard device={device} deviceInfo={deviceInfo} />
        )}
        renderDefault={(
          device: ?Device,
          deviceInfo: ?DeviceInfo,
          isGenuine: ?boolean,
          errors: {
            dashboardError: ?Error,
            genuineError: ?Error,
          },
        ) => (
          <WorkflowWithIcon
            device={device}
            deviceInfo={deviceInfo}
            errors={errors}
            isGenuine={isGenuine}
          />
        )}
      />
    )
  }
}

export default ManagerPage
