// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import type { StepId } from "./types";

class SignTransactionModal extends PureComponent<{}, { stepId: StepId }> {
  state = {
    stepId: "amount",
  };

  handleReset = () =>
    this.setState({
      stepId: "amount",
    });

  handleStepChange = (stepId: StepId) => this.setState({ stepId });

  render() {
    const { stepId } = this.state;

    return (
      <Modal
        name="MODAL_SIGN_TRANSACTION"
        centered
        refocusWhenChange={stepId}
        onHide={this.handleReset}
        preventBackdropClick
        render={({ onClose, data }) => (
          <Body
            stepId={stepId}
            onClose={() => {
              if (data.onCancel) {
                data.onCancel();
              }
              onClose();
            }}
            onChangeStepId={this.handleStepChange}
            params={data || {}}
          />
        )}
      />
    );
  }
}

export default SignTransactionModal;
