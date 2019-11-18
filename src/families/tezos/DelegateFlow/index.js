// @flow

import React, { PureComponent } from 'react'
import Modal from 'components/base/Modal'
import Body from './Body'

type State = {
  stepId: string,
}

class SendModal extends PureComponent<{}, State> {
  state = {
    stepId: 'starter',
  }

  handleReset = () =>
    this.setState({
      stepId: 'starter',
    })

  handleStepChange = (stepId: string) => {
    this.setState({ stepId })
  }

  render() {
    const { stepId } = this.state

    const isModalLocked = !['account', 'confirmation'].includes(stepId)

    return (
      <Modal
        name="MODAL_DELEGATE"
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
