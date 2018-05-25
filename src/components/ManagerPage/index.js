// @flow

import React, { Component, Fragment } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

// import Pills from 'components/base/Pills'

import AppsList from './AppsList'
// import DeviceInfos from './DeviceInfos'
// import FirmwareUpdate from './FirmwareUpdate'
import EnsureDevice from './EnsureDevice'
import EnsureDashboard from './EnsureDashboard'
import EnsureGenuine from './EnsureGenuine'

const TABS = [{ key: 'apps', value: 'apps' }, { key: 'device', value: 'device' }]

type Props = {
  t: T,
}

type State = {
  // currentTab: 'apps' | 'device',
}

class ManagerPage extends Component<Props, State> {
  // state = {
  //   currentTab: 'apps',
  // }

  // componentWillReceiveProps(nextProps) {
  //   const { device } = this.props
  //   const { currentTab } = this.state
  //   if (device && !nextProps.device && currentTab === 'device') {
  //     this.setState({ currentTab: 'apps' })
  //   }
  // }

  // handleTabChange = t => this.setState({ currentTab: t.value })

  createTabs = (device, nbDevices) => {
    const { t } = this.props
    return TABS.map(i => {
      let label = t(`manager:tabs.${i.key}`)
      if (i.key === 'device') {
        if (!device) {
          return null
        }
        label += ` (${nbDevices})`
      }
      return { ...i, label }
    }).filter(Boolean)
  }

  render() {
    const { t } = this.props
    // const { currentTab } = this.state

    return (
      <Fragment>
        <EnsureDevice>
          {device => (
            <EnsureDashboard device={device}>
              {deviceInfo => (
                <Fragment>
                  {/* <Pills
                    items={this.createTabs(device, nbDevices)}
                    activeKey={currentTab}
                    onChange={this.handleTabChange}
                    mb={6}
                  /> */}
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
