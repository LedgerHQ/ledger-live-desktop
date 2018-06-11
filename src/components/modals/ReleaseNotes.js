// @flow
import React, { PureComponent } from 'react'

import { MODAL_RELEASES_NOTES } from 'config/constants'
import Modal, { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'

class ReleaseNotes extends PureComponent<*, *> {
  render() {
    return (
      <Modal
        name={MODAL_RELEASES_NOTES}
        render={({ data, onClose }) => (
          <ModalBody onClose={onClose}>
            <ModalTitle>Release Notes</ModalTitle>
            <ModalContent>{data}</ModalContent>
          </ModalBody>
        )}
      />
    )
  }
}

export default ReleaseNotes
