// @flow

import React, { PureComponent } from 'react'
import { MODAL_SEND } from 'config/constants'
import Modal from 'components/base/Modal'
import Body from './Body'

class SendModal extends PureComponent<{}, { stepId: string }> {
  state = {
    stepId: 'amount',
  }

  handleReset = () =>
    this.setState({
      stepId: 'amount',
    })

  handleStepChange = (stepId: string) => this.setState({ stepId })

  render() {
    const { stepId } = this.state

    const isModalLocked = stepId === 'amount' || stepId === 'verification'

    return (
      <Modal
        name={MODAL_SEND}
        centered
        refocusWhenChange={stepId}
        onHide={this.handleReset}
        preventBackdropClick={isModalLocked}
        render={({ onClose, data }) => (
          <Body
            stepId={stepId}
            onClose={onClose}
            onChangeStepId={this.handleStepChange}
            params={data || {}}
          />
        )}
      />
    )
  }
}

export default SendModal
