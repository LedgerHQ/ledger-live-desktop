// @flow
import React, { PureComponent } from 'react'
import { MODAL_SEND } from 'config/constants'
import Modal from 'components/base/Modal'
import SendModalBody from './SendModalBody'

class SendModal extends PureComponent<{}, { resetId: number }> {
  state = { resetId: 0 }
  handleReset = () => {
    this.setState(({ resetId }) => ({ resetId: resetId + 1 }))
  }
  render() {
    const { resetId } = this.state
    return (
      <Modal
        name={MODAL_SEND}
        onHide={this.handleReset}
        render={({ data, onClose }) => (
          <SendModalBody
            key={resetId}
            {...this.props}
            initialAccount={data && data.account}
            onClose={onClose}
          />
        )}
      />
    )
  }
}

export default SendModal
