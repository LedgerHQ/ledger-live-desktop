// @flow

import React from 'react'

import type { Node } from 'react'
import type { Device } from 'types/common'

import Workflow from './Workflow'
import WorkflowDefault from './WorkflowDefault'
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
        <Dashboard device={device} deviceInfo={deviceInfo} />
      )}
      renderDefault={(
        device: ?Device,
        deviceInfo: ?DeviceInfo,
        dashboardError: ?Error,
        isGenuine: ?boolean,
      ) => (
        <WorkflowDefault
          device={device}
          deviceInfo={deviceInfo}
          dashboardError={dashboardError}
          isGenuine={isGenuine}
        />
      )}
    />
  )
}

export default ManagerPage
