// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Modal, { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'
import Workflow from 'components/Workflow'
import WorkflowDefault from 'components/Workflow/WorkflowDefault'

type Props = {
  t: T,
  onGenuineCheck: (isGenuine: boolean) => void,
}

type State = {}

class GenuineCheck extends PureComponent<Props, State> {
  renderBody = ({ onClose }) => {
    const { t, onGenuineCheck } = this.props

    // TODO: use the real devices list. for now we force choosing only
    // the current device because we don't handle multi device in MVP

    return (
      <ModalBody onClose={onClose}>
        <ModalTitle>{t('app:genuinecheck.modal.title')}</ModalTitle>
        <ModalContent>
          <Workflow
            onGenuineCheck={isGenuine => onGenuineCheck(isGenuine)}
            renderDefault={(device, deviceInfo, isGenuine, errors) => (
              <WorkflowDefault
                device={device}
                deviceInfo={deviceInfo}
                isGenuine={isGenuine}
                errors={errors} // TODO: FIX ERRORS
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

export default translate()(GenuineCheck)
