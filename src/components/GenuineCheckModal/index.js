// @flow

import React, { PureComponent, Fragment } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Modal, { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'
import Workflow from 'components/Workflow'
import WorkflowDefault from 'components/Workflow/WorkflowDefault'

type Props = {
  t: T,
  onGenuineCheckPass: () => void,
  onGenuineCheckFailed: () => void,
  onGenuineCheckUnavailable: Error => void,
}

type State = {}

class GenuineCheckStatus extends PureComponent<*> {
  componentDidUpdate() {
    this.sideEffect()
  }
  sideEffect() {
    const {
      isGenuine,
      error,
      onGenuineCheckPass,
      onGenuineCheckFailed,
      onGenuineCheckUnavailable,
    } = this.props
    if (isGenuine !== null) {
      if (isGenuine) {
        onGenuineCheckPass()
      } else {
        onGenuineCheckFailed()
      }
    } else if (error) {
      onGenuineCheckUnavailable(error)
    }
  }
  render() {
    return null
  }
}

/* eslint-disable react/no-multi-comp */
class GenuineCheck extends PureComponent<Props, State> {
  renderBody = ({ onClose }) => {
    const { t, onGenuineCheckPass, onGenuineCheckFailed, onGenuineCheckUnavailable } = this.props

    // TODO: use the real devices list. for now we force choosing only
    // the current device because we don't handle multi device in MVP

    return (
      <ModalBody onClose={onClose}>
        <ModalTitle>{t('app:genuinecheck.modal.title')}</ModalTitle>
        <ModalContent>
          <Workflow
            renderDefault={(device, deviceInfo, isGenuine, errors) => (
              <Fragment>
                <GenuineCheckStatus
                  isGenuine={isGenuine}
                  error={errors.genuineError}
                  onGenuineCheckPass={onGenuineCheckPass}
                  onGenuineCheckFailed={onGenuineCheckFailed}
                  onGenuineCheckUnavailable={onGenuineCheckUnavailable}
                />
                <WorkflowDefault
                  device={device}
                  deviceInfo={deviceInfo}
                  isGenuine={isGenuine}
                  errors={errors} // TODO: FIX ERRORS
                />
              </Fragment>
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

export default translate()(GenuineCheck)
