// @flow

import React, { PureComponent } from 'react'

import Modal, { ModalBody } from 'components/base/Modal'

type Props = {}

class ReceiveModal extends PureComponent<Props> {
  render() {
    return (
      <Modal
        name="receive"
        render={({ onClose }) => <ModalBody onClose={onClose}>receive modal</ModalBody>}
      />
    )
  }
}

export default ReceiveModal
