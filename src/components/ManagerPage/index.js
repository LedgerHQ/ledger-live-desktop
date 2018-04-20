// @flow

import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { compose } from 'redux'

import type { Device, T } from 'types/common'

import { getCurrentDevice, getDevices } from 'reducers/devices'

import Pills from 'components/base/Pills'

import AppsList from './AppsList'
import DeviceInfos from './DeviceInfos'

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
  nbDevices: getDevices(state).length,
})

const TABS = [{ key: 'apps', value: 'apps' }, { key: 'device', value: 'device' }]

type Props = {
  t: T,
  device: Device,
  nbDevices: number,
}

type State = {
  currentTab: 'apps' | 'device',
}

class ManagerPage extends PureComponent<Props, State> {
  state = {
    currentTab: 'apps',
  }

  componentWillReceiveProps(nextProps) {
    const { device } = this.props
    const { currentTab } = this.state
    if (device && !nextProps.device && currentTab === 'device') {
      this.setState({ currentTab: 'apps' })
    }
  }

  handleTabChange = t => this.setState({ currentTab: t.value })

  render() {
    const { device, t, nbDevices } = this.props
    const { currentTab } = this.state
    const tabs = TABS.map(i => {
      let label = t(`manager:tabs.${i.key}`)
      if (i.key === 'device') {
        if (!device) {
          return null
        }
        label += ` (${nbDevices})`
      }
      return { ...i, label }
    }).filter(Boolean)
    return (
      <Fragment>
        <Pills items={tabs} activeKey={currentTab} onChange={this.handleTabChange} mb={6} />
        {currentTab === 'apps' && <AppsList device={device} />}
        {currentTab === 'device' && <DeviceInfos device={device} />}
      </Fragment>
    )
  }
}

export default compose(translate(), connect(mapStateToProps))(ManagerPage)
