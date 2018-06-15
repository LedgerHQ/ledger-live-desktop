// @flow
/* eslint-disable react/jsx-no-literals */ // FIXME

import React from 'react'

import type { Node } from 'react'
import type { Device } from 'types/common'

import Workflow from 'components/Workflow/Workflow'
import WorkflowDefault from 'components/Workflow/WorkflowDefault'
import Dashboard from './Dashboard'

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

function ManagerPage(): Node {
  return (
    <Workflow
      renderFinalUpdate={(deviceInfo: DeviceInfo) => (
        <p>UPDATE FINAL FIRMARE (TEMPLATE + ACTION WIP) {deviceInfo.final}</p>
      )}
      renderMcuUpdate={(deviceInfo: DeviceInfo) => (
        <p>FLASH MCU (TEMPLATE + ACTION WIP) {deviceInfo.mcu}</p>
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
        <WorkflowDefault
          device={device}
          deviceInfo={deviceInfo}
          errors={errors}
          isGenuine={isGenuine}
        />
      )}
    />
  )
}

export default ManagerPage
