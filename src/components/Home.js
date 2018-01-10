// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import type { MapStateToProps } from 'react-redux'
import type { Devices, T } from 'types/common'

import { getDevices } from 'reducers/devices'

type Props = {
  devices: Devices,
  t: T,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  devices: getDevices(state),
})

class Home extends PureComponent<Props> {
  render() {
    const { devices, t } = this.props

    return <div>{t('common.connectedDevices', { count: devices.length })}</div>
  }
}

export default compose(connect(mapStateToProps), translate())(Home)
