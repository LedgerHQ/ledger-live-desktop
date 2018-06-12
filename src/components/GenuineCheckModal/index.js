// @flow

import logger from 'logger'
import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import type { T, Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'

import DeviceConnect from 'components/DeviceConnect'
import EnsureDeviceApp from 'components/EnsureDeviceApp'
import Modal, { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'

const mapStateToProps = state => ({
  currentDevice: getCurrentDevice(state),
})

type Props = {
  t: T,
  currentDevice: ?Device,
  onGenuineCheck: (isGenuine: boolean) => void,
}

type State = {}

class GenuineCheck extends PureComponent<Props, State> {
  renderBody = ({ onClose }) => {
    const { t, currentDevice, onGenuineCheck } = this.props

    // TODO: use the real devices list. for now we force choosing only
    // the current device because we don't handle multi device in MVP
    const reducedDevicesList = currentDevice ? [currentDevice] : []

    return (
      <ModalBody onClose={onClose}>
        <ModalTitle>{t('app:genuinecheck.modal.title')}</ModalTitle>
        <ModalContent>
          <EnsureDeviceApp
            deviceSelected={currentDevice}
            withGenuineCheck
            onGenuineCheck={onGenuineCheck}
            onStatusChange={status => {
              logger.log(`status changed to ${status}`)
            }}
            render={({ appStatus, genuineCheckStatus, deviceSelected, errorMessage }) => (
              <DeviceConnect
                appOpened={
                  appStatus === 'success' ? 'success' : appStatus === 'fail' ? 'fail' : null
                }
                withGenuineCheck
                genuineCheckStatus={genuineCheckStatus}
                devices={reducedDevicesList}
                deviceSelected={deviceSelected}
                errorMessage={errorMessage}
              />
            )}
          />
        </ModalContent>
      </ModalBody>
    )
  }

  render() {
    const { ...props } = this.props
    return <Modal {...props} render={({ onClose }) => this.renderBody({ onClose })} />
  }
}

export default compose(
  connect(mapStateToProps),
  translate(),
)(GenuineCheck)
