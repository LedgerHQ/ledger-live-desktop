// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import type { StepId } from "./types";

class SendModal extends PureComponent<{ stepId: StepId, onClose: Function }, { stepId: StepId }> {
  constructor(props: { stepId: StepId, onClose: Function }) {
    super(props);
    console.log("send fund props", props);
    this.state = {
      stepId: props.stepId || "recipient",
    };
  }

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
        onClose={this.props.onClose || (() => {})}
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
