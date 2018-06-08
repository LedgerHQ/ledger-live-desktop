// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { compose } from 'redux'

import type { Device, T } from 'types/common'

import { getCurrentDevice, getDevices } from 'reducers/devices'

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
  nbDevices: getDevices(state).length,
})

type Props = {
  t: T,
  device: ?Device,
  nbDevices: number,
  children: Function,
}

type State = {}

class EnsureDevice extends PureComponent<Props, State> {
  static defaultProps = {
    device: null,
  }

  render() {
    const { device, nbDevices, children, t } = this.props
    return device ? children(device, nbDevices) : <span>{t('manager:errors.noDevice')}</span>
  }
}

export default compose(
  translate(),
  connect(mapStateToProps),
)(EnsureDevice)
