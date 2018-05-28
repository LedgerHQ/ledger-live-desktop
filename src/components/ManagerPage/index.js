// @flow

import React, { Component, Fragment } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import AppsList from './AppsList'
// import DeviceInfos from './DeviceInfos'
import FirmwareUpdate from './FirmwareUpdate'
import EnsureDevice from './EnsureDevice'
import EnsureDashboard from './EnsureDashboard'
import EnsureGenuine from './EnsureGenuine'

type Props = {
  t: T,
}

type State = {}

class ManagerPage extends Component<Props, State> {
  render() {
    const { t } = this.props

    return (
      <Fragment>
        <EnsureDevice>
          {device => (
            <EnsureDashboard device={device}>
              {deviceInfo => (
                <Fragment>
                  {deviceInfo.mcu && <span>bootloader mode</span>}
                  {deviceInfo.final && <span>osu mode</span>}

                  {!deviceInfo.mcu &&
                    !deviceInfo.final && (
                      <EnsureGenuine device={device} t={t}>
                        <FirmwareUpdate
                          infos={{
                            targetId: deviceInfo.targetId,
                            version: deviceInfo.version,
                          }}
                          device={device}
                          t={t}
                        />
                        <AppsList device={device} />
                      </EnsureGenuine>
                    )}
                </Fragment>
              )}
            </EnsureDashboard>
          )}
        </EnsureDevice>
      </Fragment>
    )
  }
}

export default translate()(ManagerPage)
