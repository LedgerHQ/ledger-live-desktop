// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import type { StepId } from "./types";

class SendModal extends PureComponent<{}, { stepId: StepId }> {
  state = {
    stepId: "recipient",
  };

  handleReset = () =>
    this.setState({
      stepId: "recipient",
    });

  handleStepChange = (stepId: StepId) => this.setState({ stepId });

  render() {
    const { stepId } = this.state;

    const isModalLocked = ["recipient", "confirmation"].includes(stepId);

    return (
      <Modal
        name="MODAL_SEND"
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
    );
  }
}

export default SendModal;
