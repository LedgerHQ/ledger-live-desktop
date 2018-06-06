// @flow
import React, { PureComponent } from 'react'
import { MODAL_SEND } from 'config/constants'
import Modal from 'components/base/Modal'
import SendModalBody from './SendModalBody'

class SendModal extends PureComponent<{}> {
  render() {
    return (
      <Modal
        name={MODAL_SEND}
        preventBackdropClick
        render={({ data, onClose }) => (
          <SendModalBody {...this.props} initialAccount={data && data.account} onClose={onClose} />
        )}
      />
    )
  }
}

export default SendModal
