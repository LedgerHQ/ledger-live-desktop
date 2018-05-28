// @flow

import React, { Fragment } from 'react'
import { translate } from 'react-i18next'

import type { Node } from 'react'
import type { T } from 'types/common'

import AppsList from './AppsList'
// import DeviceInfos from './DeviceInfos'
// import FirmwareUpdate from './FirmwareUpdate'
import EnsureDevice from './EnsureDevice'
import EnsureDashboard from './EnsureDashboard'
import EnsureGenuine from './EnsureGenuine'

type Props = {
  t: T,
}

const ManagerPage = ({ t }: Props): Node => (
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
                    {/* <FirmwareUpdate
                      infos={{
                        targetId: deviceInfo.targetId,
                        version: deviceInfo.version,
                      }}
                      device={device}
                      t={t}
                    /> */}
                    <AppsList device={device} targetId={deviceInfo.targetId} />
                  </EnsureGenuine>
                )}
            </Fragment>
          )}
        </EnsureDashboard>
      )}
    </EnsureDevice>
  </Fragment>
)
export default translate()(ManagerPage)
