// @flow

import React, { PureComponent } from 'react'

import type { Node } from 'react'
import type { Device } from 'types/common'

import EnsureDevice from './EnsureDevice'
import EnsureDashboard from './EnsureDashboard'
import EnsureGenuine from './EnsureGenuine'

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
  renderDefault: (
    device: ?Device,
    deviceInfo: ?DeviceInfo,
    dashboardError: ?Error,
    isGenuine: ?boolean,
  ) => Node,
  renderMcuUpdate: (deviceInfo: DeviceInfo) => Node,
  renderFinalUpdate: (deviceInfo: DeviceInfo) => Node,
  renderDashboard: (device: Device, deviceInfo: DeviceInfo) => Node,
  renderError: (dashboardError: ?Error, genuineError: ?Error) => Node,
}
type State = {}

class Workflow extends PureComponent<Props, State> {
  render() {
    const {
      renderDashboard,
      renderFinalUpdate,
      renderMcuUpdate,
      renderError,
      renderDefault,
    } = this.props
    return (
      <EnsureDevice>
        {(device: Device) => (
          <EnsureDashboard device={device}>
            {(deviceInfo: ?DeviceInfo, dashboardError: ?Error) => (
              <EnsureGenuine device={device}>
                {(isGenuine: ?boolean, genuineError: ?Error) => {
                  if (dashboardError || genuineError) {
                    return renderError ? (
                      renderError(dashboardError, genuineError)
                    ) : (
                      <div>
                        {dashboardError && <span>{dashboardError.message}</span>}
                        {genuineError && <span>{genuineError.message}</span>}
                      </div>
                    )
                  }

                  if (deviceInfo && deviceInfo.mcu) {
                    return renderMcuUpdate(deviceInfo)
                  }

                  if (deviceInfo && deviceInfo.final) {
                    return renderFinalUpdate(deviceInfo)
                  }

                  if (isGenuine && deviceInfo && device && !dashboardError && !genuineError) {
                    return renderDashboard(device, deviceInfo)
                  }

                  return renderDefault(device, deviceInfo, dashboardError, isGenuine)
                }}
              </EnsureGenuine>
            )}
          </EnsureDashboard>
        )}
      </EnsureDevice>
    )
  }
}

export default Workflow
