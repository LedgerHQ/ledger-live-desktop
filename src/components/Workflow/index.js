// @flow

import React, { PureComponent } from 'react'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import type { Node } from 'react'
import type { Device } from 'types/common'

import EnsureDevice from './EnsureDevice'
import EnsureDashboard from './EnsureDashboard'
import EnsureGenuine from './EnsureGenuine'

type Error = {
  message: string,
  stack: string,
}

type Props = {
  renderDefault: (
    device: ?Device,
    deviceInfo: ?DeviceInfo,
    isGenuine: ?boolean,
    error: {
      dashboardError: ?Error,
      genuineError: ?Error,
    },
  ) => Node,
  renderMcuUpdate?: (device: Device, deviceInfo: DeviceInfo) => Node,
  renderFinalUpdate?: (device: Device, deviceInfo: DeviceInfo) => Node,
  renderDashboard?: (device: Device, deviceInfo: DeviceInfo, isGenuine: boolean) => Node,
  onGenuineCheck?: (isGenuine: boolean) => void,
  renderError?: (dashboardError: ?Error, genuineError: ?Error) => Node,
}
type State = {}

// In future, move to meri's approach; this code is way too much specific
class Workflow extends PureComponent<Props, State> {
  render() {
    const {
      renderDashboard,
      renderFinalUpdate,
      renderMcuUpdate,
      renderError,
      renderDefault,
      onGenuineCheck,
    } = this.props
    return (
      <EnsureDevice>
        {(device: Device) => (
          <EnsureDashboard device={device}>
            {(deviceInfo: ?DeviceInfo, dashboardError: ?Error) => {
              if (deviceInfo && deviceInfo.isBootloader && renderMcuUpdate) {
                return renderMcuUpdate(device, deviceInfo)
              }

              if (deviceInfo && deviceInfo.isOSU && renderFinalUpdate) {
                return renderFinalUpdate(device, deviceInfo)
              }

              return (
                <EnsureGenuine device={device} infos={deviceInfo}>
                  {(isGenuine: ?boolean, genuineError: ?Error) => {
                    if (dashboardError || genuineError) {
                      return renderError
                        ? renderError(dashboardError, genuineError)
                        : renderDefault(device, deviceInfo, isGenuine, {
                            genuineError,
                            dashboardError,
                          })
                    }

                    if (isGenuine && deviceInfo && device && !dashboardError && !genuineError) {
                      if (onGenuineCheck) onGenuineCheck(isGenuine)

                      if (renderDashboard) return renderDashboard(device, deviceInfo, isGenuine)
                    }

                    return renderDefault(device, deviceInfo, isGenuine, {
                      genuineError,
                      dashboardError,
                    })
                  }}
                </EnsureGenuine>
              )
            }}
          </EnsureDashboard>
        )}
      </EnsureDevice>
    )
  }
}

export default Workflow
