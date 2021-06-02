// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import type { StepId } from "./types";

class SignTransactionModal extends PureComponent<{}, { stepId: StepId, error?: Error }> {
  state = {
    stepId: "amount",
    error: undefined,
  };

  handleReset = () =>
    this.setState({
      stepId: "amount",
      error: undefined,
    });

  handleStepChange = (stepId: StepId) => this.setState({ stepId });

  setError = (error?: Error) => this.setState({ error });

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
                data.onCancel(this.state.error);
              }
              onClose();
            }}
            setError={this.setError}
            onChangeStepId={this.handleStepChange}
            params={data || {}}
          />
        )}
      />
    );
  }
}

export default SignTransactionModal;
