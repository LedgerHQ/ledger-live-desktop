// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import type { StepId } from "./types";

type State = {
  stepId: StepId,
};

class SendModal extends PureComponent<{}, State> {
  state = {
    stepId: "starter",
  };

  handleReset = () => this.setState({ stepId: "starter" });

  handleStepChange = (stepId: StepId) => {
    this.setState({ stepId });
  };

  render() {
    const { stepId } = this.state;
    const isModalLocked = ["account", "confirmation"].includes(stepId);

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
    );
  }
}

export default SendModal;
